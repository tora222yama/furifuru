<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ページ種別.
 * routingと1vs1対応
 */
enum EPages: string
{
    case INVALID                = 'invalid';   // 無効.
    case DASHBOARD              = 'dashboard'; // ダッシュボード.
    case PERSONAL_SETTING__SHOW = 'personal_setting__show'; // 個人設定・閲覧.
    case LOGIN                  = 'login'; // ログイン.
    case NOT_FOUND              = 'not_found'; // ページが見つからない.

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::INVALID                => '',
            self::DASHBOARD              => '\App\Http\Controllers\Pages\DashboardController@invoke',
            self::PERSONAL_SETTING__SHOW => '\App\Http\Controllers\Pages\PersonalSettingController@show',
            self::LOGIN                  => '\App\Http\Controllers\Pages\LoginController@invoke',
            self::NOT_FOUND              => '\App\Http\Controllers\Pages\NotFoundController@invoke',
        };
    }
}
