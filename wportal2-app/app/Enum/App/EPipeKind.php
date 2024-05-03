<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID                          = 'invalid';

    // queries.

    // mutations.
    case APP_PERSONAL_SETTING_EDIT_UPDATE = 'app_personal_setting_edit_update';
}
