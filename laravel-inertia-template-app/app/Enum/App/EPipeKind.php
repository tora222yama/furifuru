<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID                      = 'invalid';

    // queries.
    case APP_REDIS_QUERY              = 'app_redis_query';

    // mutations.
    case APP_INPUT_FORM_UPDATE        = 'app_input_form_update';
    case APP_REDIS_UPDATE             = 'app_redis_update';
    case APP_LOGIN_FORM_LOGIN         = 'app_login_form_login';
}
