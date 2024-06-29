<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID                                = 'invalid';

    // queries.

    // mutations.
    case APP_ATTENDANCE_CREATE                  = 'app_attendance_create';
    case APP_ATTENDANCE_DELETE                  = 'app_attendance_delete';
    case APP_ATTENDANCE_PROJECT_PRIORITY        = 'app_attendance_project_priority';
    case APP_ATTENDANCE_DIVISION_PRIORITY       = 'app_attendance_division_priority';
    case APP_DIVISION_UPDATE                    = 'app_division_update';
    case APP_DIVISION_USER_UPDATE               = 'app_division_user_update';
    case APP_PROJECT_UPDATE                     = 'app_project_update';
    case APP_PROJECT_USER_UPDATE                = 'app_project_user_update';
    case APP_PROJECT_DELETE                     = 'app_project_delete';
    case APP_PERSONAL_SETTING_SHOW_ALIGN_SLACK  = 'app_personal_setting_show_align_slack';
    case APP_PERSONAL_SETTING_EDIT_UPDATE       = 'app_personal_setting_edit_update';

    case APP_USER_UPDATE                        = 'app_user_update';
}
