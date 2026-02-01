<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use App\Dto\Shift\ShiftRegistrationCommand;
use App\Models\App\Trn\TrnUserShiftEntry;
use App\Services\External\GoogleCalendarService;
use App\ValueObjects\ShiftType;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

readonly class ShiftRegistrationUseCase
{
    public function __construct(private GoogleCalendarService $googleCalendarService) {}

    /**
     * @return ShiftEntries 失敗したシフト一覧
     */
    public function execute(ShiftRegistrationCommand $command): ShiftEntries
    {
        $shifts = ShiftEntries::fromArray($command->shifts);

        $this->saveShifts($command->trnUserId, $shifts);

        return $this->syncShifts($command->authEmail, $shifts);
    }

    private function saveShifts(int $trnUserId, ShiftEntries $shifts): void
    {
        foreach ($shifts as $shift) {
            TrnUserShiftEntry::updateOrCreate(
                [
                    'user_id' => $trnUserId,
                    'date'    => $shift->date->toDateString(),
                ],
                [
                    'type' => $shift->type->value,
                ],
            );
        }
    }

    /**
     * @param  ShiftEntries  $shifts
     *                                同期実行。将来キュー投入に置き換え可能。
     */
    private function syncShifts(string $authEmail, ShiftEntries $shifts): ShiftEntries
    {
        $calendarIdList = collect();
        $failed         = ShiftEntries::empty();

        foreach ($shifts as $shift) {
            $date     = $shift->date->toCarbon();
            $type     = $shift->type;

            $allDayOk = $this->createAllDayEvent($authEmail, $calendarIdList, $date, $type);
            $timedOk  = $this->createTimedEvent($authEmail, $calendarIdList, $date, $type);

            if (! $allDayOk || ! $timedOk) {
                $failed->push($shift);
            }
        }

        return $failed;
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
                $description
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
                $description
            );

            return true;
        } catch (Throwable $e) {
            Log::warning('google calendar timed sync failed: '.$e->getMessage());

            return false;
        }
    }

    private function summaryForType(ShiftType $type, bool $allDay): string
    {
        return match ($type) {
            ShiftType::Office  => $allDay ? '終日 出社' : '出社',
            ShiftType::Remote  => $allDay ? '終日 在宅' : '在宅',
            ShiftType::Holiday => $allDay ? '終日 休暇' : '休暇',
        };
    }

    private function locationForType(ShiftType $type): string
    {
        return match ($type) {
            ShiftType::Office  => 'Office',
            ShiftType::Remote  => 'Remote',
            ShiftType::Holiday => '',
        };
    }
}
