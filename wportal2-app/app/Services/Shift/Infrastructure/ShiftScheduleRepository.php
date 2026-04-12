<?php

declare(strict_types=1);

namespace App\Services\Shift\Infrastructure;

use App\Enum\App\ECalendarSyncStatus;
use App\Models\App\Trn\TrnShiftSchedule;
use App\Services\Shift\Domain\ShiftDate;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftEntry;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftType;
use Carbon\CarbonImmutable;

final class ShiftScheduleRepository implements ShiftScheduleRepositoryInterface
{
    /**
     * {@inheritdoc}
     *
     * 既存の当月シフトを物理削除し、新しいシフトを PENDING 状態でバルクインサートする。
     * トランザクション内で呼び出すこと。
     */
    public function replaceMonthlyShifts(int $trnUserId, ShiftEntries $shifts): void
    {
        $monthRange = $shifts->monthRangeOrFail();

        // 既存の当月シフトを物理削除
        TrnShiftSchedule::query()
            ->where('trn_user_id', $trnUserId)
            ->whereBetween('shift_date', [$monthRange['start'], $monthRange['end']])
            ->delete();

        // 新しいシフトを PENDING でバルクインサート
        $rows       = [];
        $now        = now();
        foreach ($shifts as $shift) {
            $rows[] = [
                'trn_user_id'            => $trnUserId,
                'shift_date'             => $shift->date->toDateString(),
                'shift_type'             => $shift->type->value,
                'e_calendar_sync_status' => ECalendarSyncStatus::PENDING->value,
                'created_at'             => $now,
                'updated_at'             => $now,
            ];
        }

        TrnShiftSchedule::insert($rows);
    }

    /**
     * {@inheritdoc}
     */
    public function getMonthlyShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries
    {
        $start   = $targetMonth->startOfMonth()->toDateString();
        $end     = $targetMonth->endOfMonth()->toDateString();

        $records = TrnShiftSchedule::query()
            ->where('trn_user_id', $trnUserId)
            ->whereBetween('shift_date', [$start, $end])
            ->orderBy('shift_date')
            ->get();

        $entries = ShiftEntries::empty();
        foreach ($records as $record) {
            /** @var TrnShiftSchedule $record */
            $entries->push(new ShiftEntry(
                new ShiftDate($record->shift_date),
                ShiftType::from($record->shift_type),
                ECalendarSyncStatus::from((int) $record->e_calendar_sync_status),
            ));
        }

        return $entries;
    }

    /**
     * {@inheritdoc}
     */
    public function updateSyncStatuses(int $trnUserId, ShiftEntries $shifts, ECalendarSyncStatus $status): void
    {
        $dates = array_map(
            fn (ShiftEntry $shift): string => $shift->date->toDateString(),
            iterator_to_array($shifts),
        );

        if ($dates === []) {
            return;
        }

        TrnShiftSchedule::query()
            ->where('trn_user_id', $trnUserId)
            ->whereIn('shift_date', $dates)
            ->update(['e_calendar_sync_status' => $status->value]);
    }

    /**
     * {@inheritdoc}
     */
    public function getPendingOrFailedShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries
    {
        $start   = $targetMonth->startOfMonth()->toDateString();
        $end     = $targetMonth->endOfMonth()->toDateString();

        $records = TrnShiftSchedule::query()
            ->where('trn_user_id', $trnUserId)
            ->whereBetween('shift_date', [$start, $end])
            ->whereIn('e_calendar_sync_status', [
                ECalendarSyncStatus::PENDING->value,
                ECalendarSyncStatus::FAILED->value,
            ])
            ->orderBy('shift_date')
            ->get();

        $shifts  = [];
        foreach ($records as $record) {
            /** @var TrnShiftSchedule $record */
            $shifts[] = [
                'date' => $record->shift_date,
                'type' => $record->shift_type,
            ];
        }

        return ShiftEntries::fromArray($shifts);
    }
}
