<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Models\App\Trn\TrnUserShiftSetting;
use App\ValueObjects\ShiftStartSettings;

final class ShiftSettingsRepository
{
    /**
     * ユーザーの勤務開始時刻設定を upsert する。
     */
    public function upsert(int $trnUserId, ShiftStartSettings $settings): void
    {
        TrnUserShiftSetting::updateOrCreate(
            ['trn_user_id' => $trnUserId],
            [
                'office_start_time' => $settings->officeStartTime,
                'remote_start_time' => $settings->remoteStartTime,
            ],
        );
    }

    /**
     * ユーザーの勤務開始時刻設定を取得する。未設定の場合はデフォルト値を返す。
     */
    public function findOrDefault(int $trnUserId): ShiftStartSettings
    {
        /** @var TrnUserShiftSetting|null $record */
        $record = TrnUserShiftSetting::query()
            ->where('trn_user_id', $trnUserId)
            ->first();

        if ($record === null) {
            return ShiftStartSettings::default();
        }

        return new ShiftStartSettings(
            $record->office_start_time,
            $record->remote_start_time,
        );
    }
}
