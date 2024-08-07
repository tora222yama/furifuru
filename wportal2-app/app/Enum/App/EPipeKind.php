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
    case APP_DIVISION_DELETE                    = 'app_division_delete';
    case APP_PROJECT_UPDATE                     = 'app_project_update';
    case APP_PROJECT_USER_UPDATE                = 'app_project_user_update';
    case APP_PROJECT_DELETE                     = 'app_project_delete';
    case APP_PROJECT_CREATE                     = 'app_project_create';
    case APP_PERSONAL_SETTING_SHOW_ALIGN_SLACK  = 'app_personal_setting_show_align_slack';
    case APP_PERSONAL_SETTING_EDIT_UPDATE       = 'app_personal_setting_edit_update';

    case APP_USER_CREATE                        = 'app_user_create';

    case APP_USER_UPDATE                        = 'app_user_update';

    case APP_LEGACY_LOGIN                       = 'app_legacy_login';
    case APP_ONETIME_PASSWORD_LOGIN             = 'app_onetime_password_login';

    // sample-queries.
    case SAMPLE_PAGINATION_QUERY                = 'sample_pagination_query';
    case SAMPLE_REDIS_QUERY                     = 'sample_redis_query';

    // sample-mutations.
    case SAMPLE_INPUT_FORM_UPDATE               = 'sample_input_form_update';
    case SAMPLE_REDIS_UPDATE                    = 'sample_redis_update';
    case SAMPLE_LOGIN_FORM_LOGIN                = 'sample_login_form_login';
}
