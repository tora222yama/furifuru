<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ページ種別.
 * routingと1vs1対応
 */
enum EPages: string
{
    case INVALID                          = 'invalid';   // 無効.
    case DASHBOARD                        = 'dashboard'; // ダッシュボード.
    case ATTENDANCE                       = 'attendance'; // 勤怠共有.
    case ATTENDANCE_CREATE                = 'attendance_create'; // 勤怠共有・追加.
    case ATTENDANCE_DELETE                = 'attendance_delete'; // 勤怠共有・削除.
    case ATTENDANCE_DIVISION_PRIORITY     = 'attendance_division_priority'; // 課優先度変更.
    case ATTENDANCE_PROJECT_PRIORITY      = 'attendance_project_priority'; // プロジェクト優先度変更.
    case SHOP                             = 'shop'; // ショップ.
    case ATTENDANCE__EDIT                 = 'attendance__edit'; // 勤怠修正.
    case ATTENDANCE__TABLE                = 'attendance__table'; // 勤怠一覧表.
    case DIVISION                         = 'division'; // 課一覧.
    case DIVISION__SHOW                   = 'division__show'; // 課詳細.
    case DIVISION__EDIT                   = 'division__edit'; // 課編集.
    case PROJECT                          = 'project'; // プロジェクト一覧.
    case PROJECT__SHOW                    = 'project__show'; // プロジェクト詳細.
    case PROJECT__EDIT                    = 'project__edit'; // プロジェクト編集.
    case PROJECT__DELETE                  = 'project__delete'; // プロジェクト削除.
    case USER                             = 'user'; // メンバー一覧.
    case USER__SHOW                       = 'user__show'; // メンバー詳細.
    case USER__EDIT                       = 'user__edit'; // メンバー編集.
    case PERSONAL_SETTING__SHOW           = 'personal_setting__show'; // 個人設定・閲覧.
    case PERSONAL_SETTING__EDIT           = 'personal_setting__edit'; // 個人設定・編集.
    case LOGIN                            = 'login'; // ログイン.
    case NOT_FOUND                        = 'not_found'; // ページが見つからない.

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::DASHBOARD                      => '\App\Http\Controllers\Pages\DashboardController@invoke',
            self::ATTENDANCE                     => '\App\Http\Controllers\Pages\AttendanceController@invoke',
            self::ATTENDANCE_CREATE              => '\App\Http\Controllers\Pages\AttendanceController@create',
            self::ATTENDANCE_DELETE              => '\App\Http\Controllers\Pages\AttendanceController@delete',
            self::ATTENDANCE_DIVISION_PRIORITY   => '\App\Http\Controllers\Pages\AttendanceController@division_priority',
            self::ATTENDANCE_PROJECT_PRIORITY    => '\App\Http\Controllers\Pages\AttendanceController@project_priority',
            self::DIVISION                       => '\App\Http\Controllers\Pages\DivisionController@invoke',
            self::DIVISION__SHOW                 => '\App\Http\Controllers\Pages\DivisionController@show',
            self::DIVISION__EDIT                 => '\App\Http\Controllers\Pages\DivisionController@edit',
            self::PROJECT                        => '\App\Http\Controllers\Pages\ProjectController@invoke',
            self::PROJECT__SHOW                  => '\App\Http\Controllers\Pages\ProjectController@show',
            self::PROJECT__EDIT                  => '\App\Http\Controllers\Pages\ProjectController@edit',
            self::PROJECT__DELETE                => '\App\Http\Controllers\Pages\ProjectController@delete',
            self::USER                           => '\App\Http\Controllers\Pages\UserController@invoke',
            self::USER__SHOW                     => '\App\Http\Controllers\Pages\UserController@show',
            self::USER__EDIT                     => '\App\Http\Controllers\Pages\UserController@edit',
            self::PERSONAL_SETTING__SHOW         => '\App\Http\Controllers\Pages\PersonalSettingController@show',
            self::PERSONAL_SETTING__EDIT         => '\App\Http\Controllers\Pages\PersonalSettingController@edit',
            self::LOGIN                          => '\App\Http\Controllers\Pages\LoginController@invoke',
            self::NOT_FOUND                      => '\App\Http\Controllers\Pages\NotFoundController@invoke',
            default                              => '',
        };
    }
}
