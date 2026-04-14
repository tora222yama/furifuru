<?php

declare(strict_types=1);

namespace Tests\Fakes\Shift;

use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use Carbon\CarbonImmutable;

final class FakeShiftScheduleRepository implements ShiftScheduleRepositoryInterface
{
    /** @var array<int, array{trnUserId:int,shifts:ShiftEntries}> */
    public array $replaceMonthlyShiftsCalls = [];

    /** @var array<int, array{trnUserId:int,targetMonth:CarbonImmutable}> */
    public array $getMonthlyShiftsCalls     = [];

    /** @var array<int, array{trnUserId:int,shifts:ShiftEntries,status:ECalendarSyncStatus}> */
    public array $updateSyncStatusesCalls   = [];

    /** @var array<int, array{trnUserId:int,targetMonth:CarbonImmutable}> */
    public array $getPendingOrFailedCalls   = [];

    /** @var array<string, ShiftEntries> key: "{trnUserId}:{Y-m}" */
    private array $store                    = [];

    /** @var array<string, ShiftEntries> key: "{trnUserId}:{Y-m}" */
    private array $pendingOrFailedStore     = [];

    public function replaceMonthlyShifts(int $trnUserId, ShiftEntries $shifts): void
    {
        $this->replaceMonthlyShiftsCalls[] = [
            'trnUserId' => $trnUserId,
            'shifts'    => $shifts,
        ];

        $monthRange                        = $shifts->monthRangeOrFail();
        $month                             = CarbonImmutable::createFromFormat('Y-m-d', $monthRange['start'])?->format('Y-m') ?? '';
        $key                               = "{$trnUserId}:{$month}";

        $this->store[$key]                 = $shifts;
    }

    public function getMonthlyShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries
    {
        $this->getMonthlyShiftsCalls[] = [
            'trnUserId'   => $trnUserId,
            'targetMonth' => $targetMonth,
        ];

        $key                           = "{$trnUserId}:{$targetMonth->format('Y-m')}";

        return $this->store[$key] ?? ShiftEntries::fromArray([]);
    }

    public function updateSyncStatuses(int $trnUserId, ShiftEntries $shifts, ECalendarSyncStatus $status): void
    {
        $this->updateSyncStatusesCalls[] = [
            'trnUserId' => $trnUserId,
            'shifts'    => $shifts,
            'status'    => $status,
        ];
    }

    /**
     * テスト用：指定ユーザー・月のシフトをあらかじめセットする。
     */
    public function seed(int $trnUserId, ShiftEntries $shifts): void
    {
        if ($shifts->isEmpty()) {
            return;
        }

        $month             = $shifts->first()?->date->toCarbonImmutable()->format('Y-m') ?? '';
        $key               = "{$trnUserId}:{$month}";

        $this->store[$key] = $shifts;
    }

    /**
     * テスト用：指定ユーザー・月の PENDING/FAILED シフトをあらかじめセットする。
     */
    public function seedPendingOrFailed(int $trnUserId, CarbonImmutable $targetMonth, ShiftEntries $shifts): void
    {
        $key                               = "{$trnUserId}:{$targetMonth->format('Y-m')}";
        $this->pendingOrFailedStore[$key]  = $shifts;
    }

    public function getPendingOrFailedShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries
    {
        $this->getPendingOrFailedCalls[] = [
            'trnUserId'   => $trnUserId,
            'targetMonth' => $targetMonth,
        ];

        $key                             = "{$trnUserId}:{$targetMonth->format('Y-m')}";

        return $this->pendingOrFailedStore[$key] ?? ShiftEntries::empty();
    }

    public function getAllUsersMonthlyShifts(CarbonImmutable $targetMonth): array
    {
        $month   = $targetMonth->format('Y-m');
        $grouped = [];

        foreach ($this->store as $key => $entries) {
            [$userId, $m] = explode(':', $key);
            if ($m === $month) {
                $grouped[(int) $userId] = $entries;
            }
        }

        return $grouped;
    }
}
