<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use App\Constant\ShiftScheduleConstant;
use App\Dto\Shift\ShiftSyncResult;
use App\Dto\Shift\SyncShiftCalendarCommand;
use App\Enum\App\ECalendarSyncStatus;
use App\Services\External\GoogleCalendarServiceInterface;
use App\ValueObjects\ShiftType;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * 指定月の DB シフトを正とし、Google Calendar を上書き同期するユースケース。
 *
 * - 対象: 指定月の DB に存在する全シフト（PENDING / FAILED / SYNCED すべて）
 * - 処理: 対象月のカレンダーイベントを削除 → DB のシフトで再作成
 * - これにより Google Calendar 側の手動変更も上書きされ、DB が SoT に保たれる
 */
final readonly class SyncShiftCalendarUseCase
{
    public function __construct(
        private GoogleCalendarServiceInterface $googleCalendarService,
        private ShiftScheduleRepositoryInterface $shiftScheduleRepository,
    ) {}

    /**
     * @return ShiftSyncResult 成功・失敗を含む同期結果
     */
    public function execute(SyncShiftCalendarCommand $command): ShiftSyncResult
    {
        $shifts     = $this->shiftScheduleRepository->getMonthlyShifts($command->trnUserId, $command->targetMonth);

        if ($shifts->isEmpty()) {
            return new ShiftSyncResult(ShiftEntries::empty(), ShiftEntries::empty());
        }

        // 対象月のカレンダーイベントを削除（手動変更を含む全イベントを一掃）
        $monthRange = [
            'start' => $command->targetMonth->startOfMonth()->toDateString(),
            'end'   => $command->targetMonth->endOfMonth()->toDateString(),
        ];
        $this->deleteGoogleCalendarMonth($command->authEmail, $monthRange);

        // DB のシフトでカレンダーを再作成
        $result     = $this->syncShifts($command->authEmail, $shifts);

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
            Log::warning('google calendar month delete skipped: invalid month range');

            return;
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

            if ($allDayOk && $timedOk) {
                $succeeded->push($shift);
            } else {
                $failed->push($shift);
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
            Log::warning('google calendar all-day sync failed (re-sync): '.$e->getMessage());

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
            Log::warning('google calendar timed sync failed (re-sync): '.$e->getMessage());

            return false;
        }
    }

    private function isShiftEvent(Event $event): bool
    {
        $description = $event->getDescription();

        return $description !== null && str_contains($description, ShiftScheduleConstant::MARKER);
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
