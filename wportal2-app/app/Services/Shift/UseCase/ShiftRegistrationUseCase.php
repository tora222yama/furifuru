<?php

declare(strict_types=1);

namespace App\Services\Shift\UseCase;

use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\Domain\ShiftCalendarSyncer;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftSettingsRepositoryInterface;
use Illuminate\Support\Facades\DB;

final readonly class ShiftRegistrationUseCase
{
    public function __construct(
        private ShiftCalendarSyncer $calendarSyncer,
        private ShiftScheduleRepositoryInterface $shiftScheduleRepository,
        private ShiftSettingsRepositoryInterface $shiftSettingsRepository,
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
        $hasShifts  = ! $shifts->isEmpty();
        if ($hasShifts) {
            $shifts->monthRangeOrFail();
        }

        // DBへの保存（トランザクション内）
        DB::transaction(function () use ($command, $shifts, $hasShifts): void {
            if ($hasShifts) {
                $this->shiftScheduleRepository->upsertShifts($command->trnUserId, $shifts);
            }
            $this->shiftSettingsRepository->upsert($command->trnUserId, $command->startSettings);
        });

        if (! $hasShifts) {
            return new ShiftSyncResult(ShiftEntries::empty(), ShiftEntries::empty());
        }

        // Google Calendar 連携（トランザクション外・ベストエフォート）
        $result     = $this->calendarSyncer->replaceCalendarDates(
            $command->authEmail,
            $shifts,
            $command->startSettings,
        );

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
}
