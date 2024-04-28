<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ページ種別.
 * routingと1vs1対応
 */
enum EPages: string
{
    case INVALID           = 'invalid';   // 無効.
    case DASHBOARD         = 'dashboard'; // ダッシュボード.
    case NOT_FOUND         = 'not_found'; // ページが見つからない.

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::INVALID           => '',
            self::DASHBOARD         => '\App\Http\Controllers\Pages\DashboardController@invoke',
            self::NOT_FOUND         => '\App\Http\Controllers\Pages\NotFoundController@invoke',
        };
    }
}
