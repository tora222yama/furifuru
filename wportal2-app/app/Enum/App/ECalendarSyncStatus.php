<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * Googleカレンダー同期ステータス
 *
 * @note 値の変更禁止.
 */
enum ECalendarSyncStatus: int
{
    case INVALID = 0; // 無効値.

    case PENDING = 1; // 未同期（DB登録直後）.
    case SYNCED  = 2; // 同期済み.
    case FAILED  = 3; // 同期失敗（要リトライ）.
}
