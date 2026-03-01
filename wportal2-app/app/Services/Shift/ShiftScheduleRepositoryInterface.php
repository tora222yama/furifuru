<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use App\Enum\App\ECalendarSyncStatus;
use Carbon\CarbonImmutable;

interface ShiftScheduleRepositoryInterface
{
    /**
     * 指定月のシフトを洗い替えする（既存をアーカイブして新規挿入）。
     * トランザクション内で呼び出すこと。
     */
    public function replaceMonthlyShifts(int $trnUserId, ShiftEntries $shifts): void;

    /**
     * 指定月のシフト一覧をDBから取得する。
     */
    public function getMonthlyShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries;

    /**
     * 指定シフトのカレンダー同期ステータスを一括更新する。
     */
    public function updateSyncStatuses(int $trnUserId, ShiftEntries $shifts, ECalendarSyncStatus $status): void;
}
