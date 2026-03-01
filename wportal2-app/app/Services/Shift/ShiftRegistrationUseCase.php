<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use App\Constant\ShiftScheduleConstant;
use App\Dto\Shift\ShiftRegistrationCommand;
use App\Dto\Shift\ShiftSyncResult;
use App\Enum\App\ECalendarSyncStatus;
use App\Services\External\GoogleCalendarServiceInterface;
use App\ValueObjects\ShiftType;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

final readonly class ShiftRegistrationUseCase
{
    public function __construct(
        private GoogleCalendarServiceInterface $googleCalendarService,
        private ShiftScheduleRepositoryInterface $shiftScheduleRepository,
    ) {}

    /**
     * @return ShiftSyncResult 成功・失敗を含む同期結果
     *
     * DB書き込みをトランザクション内で確定し、Google Calendar連携はその後ベストエフォートで実行する。
     * 外部API（Google Calendar）の失敗はDBデータに影響しない。
     */
    public function execute(ShiftRegistrationCommand $command): ShiftSyncResult
    {
        $shifts     = ShiftEntries::fromArray($command->shifts);

        if ($shifts->isEmpty()) {
            return new ShiftSyncResult(ShiftEntries::empty(), ShiftEntries::empty());
        }

        // DBへの保存（トランザクション内）
        DB::transaction(function () use ($command, $shifts): void {
            $this->shiftScheduleRepository->replaceMonthlyShifts($command->trnUserId, $shifts);
        });

        // Google Calendar 連携（トランザクション外・ベストエフォート）
        $monthRange = $shifts->monthRangeOrFail();
        $this->deleteGoogleCalendarMonth($command->authEmail, $monthRange);

        $result     = $this->syncShifts($command->authEmail, $shifts);

        // Google Calendar 同期結果をDBのステータスに反映
        if (! $result->successes->isEmpty()) {
            $this->shiftScheduleRepository->updateSyncStatuses(
                $command->trnUserId,
                $result->successes,
                ECalendarSyncStatus::SYNCED,
            );
        }

        if (! $result->failures->isEmpty()) {
            $this->shiftScheduleRepository->updateSyncStatuses(
                $command->trnUserId,
                $result->failures,
                ECalendarSyncStatus::FAILED,
            );
        }

        return $result;
    }

    /**
     * 指定月のGoogleカレンダー上のシフト予定を削除する.
     *
     * @param  array{start:string,end:string}  $monthRange
     */
    private function deleteGoogleCalendarMonth(string $authEmail, array $monthRange): void
    {
        $start = CarbonImmutable::createFromFormat('Y-m-d', $monthRange['start']);
        $end   = CarbonImmutable::createFromFormat('Y-m-d', $monthRange['end']);

        if ($start === null || $end === null) {
            throw new InvalidArgumentException('Invalid month range date format');
        }

        $start = $start->startOfDay();
        $end   = $end->endOfDay();

        try {
            $this->googleCalendarService->deleteSchedules(
                $authEmail,
                $start,
                $end,
                fn (Event $event): bool => $this->isShiftEvent($event),
            );
        } catch (Throwable $e) {
            Log::warning('google calendar month delete failed: '.$e->getMessage());
        }
    }

    /**
     * @param  ShiftEntries  $shifts  同期実行。将来キュー投入に置き換え可能。
     */
    private function syncShifts(string $authEmail, ShiftEntries $shifts): ShiftSyncResult
    {
        $calendarIdList = collect();
        $failed         = ShiftEntries::empty();
        $succeeded      = ShiftEntries::empty();

        foreach ($shifts as $shift) {
            $date     = $shift->date->toCarbon();
            $type     = $shift->type;

            $allDayOk = $this->createAllDayEvent($authEmail, $calendarIdList, $date, $type);
            $timedOk  = $this->createTimedEvent($authEmail, $calendarIdList, $date, $type);

            $synced   = $allDayOk && $timedOk;

            if (! $synced) {
                $failed->push($shift);
            } else {
                $succeeded->push($shift);
            }
        }

        return new ShiftSyncResult($succeeded, $failed);
    }

    /** @param Collection<int, string> $calendarIdList */
    private function createAllDayEvent(string $authEmail, Collection $calendarIdList, Carbon $date, ShiftType $type): bool
    {
        $start       = $date->copy()->startOfDay();
        $end         = $date->copy()->endOfDay();
        $summary     = $this->summaryForType($type, true);
        $location    = $this->locationForType($type);
        $description = '終日';

        try {
            $this->googleCalendarService->blockSchedule(
                $authEmail,
                $calendarIdList,
                $start,
                $end,
                $summary,
                $location,
                $description,
                descriptionPrefix: ShiftScheduleConstant::MARKER,
            );

            return true;
        } catch (Throwable $e) {
            Log::warning('google calendar all-day sync failed: '.$e->getMessage());

            return false;
        }
    }

    /** @param Collection<int, string> $calendarIdList */
    private function createTimedEvent(string $authEmail, Collection $calendarIdList, Carbon $date, ShiftType $type): bool
    {
        if ($type === ShiftType::Holiday) {
            $start = $date->copy()->setTime(9, 0);
            $end   = $date->copy()->setTime(18, 0);
        } else {
            $start = $date->copy()->setTime(5, 0);
            $end   = $date->copy()->setTime(10, 0);
        }

        $summary     = $this->summaryForType($type, false);
        $location    = $this->locationForType($type);
        $description = 'シフト';

        try {
            $this->googleCalendarService->blockSchedule(
                $authEmail,
                $calendarIdList,
                $start,
                $end,
                $summary,
                $location,
                $description,
                descriptionPrefix: ShiftScheduleConstant::MARKER,
            );

            return true;
        } catch (Throwable $e) {
            Log::warning('google calendar timed sync failed: '.$e->getMessage());

            return false;
        }
    }

    private function isShiftEvent(Event $event): bool
    {
        $description = $event->getDescription();

        return $description !== '' && str_contains($description, ShiftScheduleConstant::MARKER);
    }

    private function summaryForType(ShiftType $type, bool $allDay): string
    {
        return match ($type) {
            ShiftType::Remote       => $allDay ? '終日 在宅' : '在宅',
            ShiftType::Office       => $allDay ? '終日 出社' : '出社',
            ShiftType::BusinessTrip => $allDay ? '終日 出張' : '出張',
            ShiftType::Holiday      => $allDay ? '終日 休暇' : '休暇',
        };
    }

    private function locationForType(ShiftType $type): string
    {
        return match ($type) {
            ShiftType::Office       => 'Office',
            ShiftType::Remote       => 'Remote',
            ShiftType::BusinessTrip => 'BusinessTrip',
            ShiftType::Holiday      => 'Holiday',
        };
    }
}
