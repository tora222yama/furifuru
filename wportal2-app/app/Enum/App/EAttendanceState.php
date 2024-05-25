<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * 出退勤ステータス
 *
 * @note 値の変更禁止.
 */
enum EAttendanceState: int
{
    case INVALID              = 0; // 無効

    case ATTENDANCE_OFFICE    = 10001; // 出勤:オフィス
    case ATTENDANCE_TELEWORK  = 10002; // 出勤:テレワーク
    case BEGIN_BREAK          = 20001; // 休憩:開始
    case END_BREAK            = 20002; // 休憩:終了
    case SWITCH_TO_OFFICE     = 30001; // 切替:オフィスへ
    case SWITCH_TO_TELEWORK   = 30002; // 切替:テレワークへ
    case LEAVING              = 40001; // 退勤

    /**
     * 勤怠状態に対応したラベルを取得する.
     */
    public function getStateLabel(): string
    {
        return match ($this) {
            EAttendanceState::INVALID             => '',
            EAttendanceState::ATTENDANCE_OFFICE   => 'オフィスで勤務開始しました',
            EAttendanceState::ATTENDANCE_TELEWORK => '在宅で勤務開始しました',
            EAttendanceState::BEGIN_BREAK         => '休憩に入りました',
            EAttendanceState::END_BREAK           => '休憩から戻りました',
            EAttendanceState::SWITCH_TO_OFFICE    => 'オフィス勤務へ切替えました',
            EAttendanceState::SWITCH_TO_TELEWORK  => '在宅勤務へ切替えました',
            EAttendanceState::LEAVING             => '退勤しました',
        };
    }
}
