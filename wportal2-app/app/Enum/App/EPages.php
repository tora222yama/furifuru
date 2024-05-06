<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ページ種別.
 * routingと1vs1対応
 */
enum EPages: string
{
    case INVALID                 = 'invalid';   // 無効.
    case DASHBOARD               = 'dashboard'; // ダッシュボード.
    case ATTENDANCE              = 'attendance'; // 勤怠共有.
    case SHOP                    = 'shop'; // ショップ.
    case ATTENDANCE__EDIT        = 'attendance__edit'; // 勤怠修正.
    case ATTENDANCE__TABLE       = 'attendance__table'; // 勤怠一覧表.
    case DIVISION                = 'division'; // 課一覧.
    case PERSONAL_SETTING__SHOW  = 'personal_setting__show'; // 個人設定・閲覧.
    case PERSONAL_SETTING__EDIT  = 'personal_setting__edit'; // 個人設定・編集.
    case LOGIN                   = 'login'; // ログイン.
    case NOT_FOUND               = 'not_found'; // ページが見つからない.

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::DASHBOARD              => '\App\Http\Controllers\Pages\DashboardController@invoke',
            self::DIVISION               => '\App\Http\Controllers\Pages\DivisionController@invoke',
            self::PERSONAL_SETTING__SHOW => '\App\Http\Controllers\Pages\PersonalSettingController@show',
            self::PERSONAL_SETTING__EDIT => '\App\Http\Controllers\Pages\PersonalSettingController@edit',
            self::LOGIN                  => '\App\Http\Controllers\Pages\LoginController@invoke',
            self::NOT_FOUND              => '\App\Http\Controllers\Pages\NotFoundController@invoke',
            default                      => '',
        };
    }
}
