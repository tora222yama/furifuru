<?php

declare(strict_types=1);

namespace App\Services\Shift\UseCase;

use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\Domain\ShiftCalendarSyncer;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftSettingsRepositoryInterface;

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
        private ShiftCalendarSyncer $calendarSyncer,
        private ShiftScheduleRepositoryInterface $shiftScheduleRepository,
        private ShiftSettingsRepositoryInterface $shiftSettingsRepository,
    ) {}

    /**
     * @return ShiftSyncResult 成功・失敗を含む同期結果
     */
    public function execute(SyncShiftCalendarCommand $command): ShiftSyncResult
    {
        $shifts        = $this->shiftScheduleRepository->getMonthlyShifts($command->trnUserId, $command->targetMonth);

        if ($shifts->isEmpty()) {
            return new ShiftSyncResult(ShiftEntries::empty(), ShiftEntries::empty());
        }

        // 対象月のカレンダーイベントを削除（手動変更を含む全イベントを一掃）し、DB のシフトで再作成
        $monthRange    = [
            'start' => $command->targetMonth->startOfMonth()->toDateString(),
            'end'   => $command->targetMonth->endOfMonth()->toDateString(),
        ];
        $startSettings = $this->shiftSettingsRepository->findOrDefault($command->trnUserId);
        $result        = $this->calendarSyncer->replaceCalendarMonth($command->authEmail, $monthRange, $shifts, $startSettings);

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
}
