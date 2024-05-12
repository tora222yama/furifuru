<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID                               = 'invalid';

    // queries.

    // mutations.
    case APP_DIVISION_UPDATE                   = 'app_division_update';
    case APP_DIVISION_USER_UPDATE              = 'app_division_user_update';
    case APP_PERSONAL_SETTING_SHOW_ALIGN_SLACK = 'app_personal_setting_show_align_slack';
    case APP_PERSONAL_SETTING_EDIT_UPDATE      = 'app_personal_setting_edit_update';
}
