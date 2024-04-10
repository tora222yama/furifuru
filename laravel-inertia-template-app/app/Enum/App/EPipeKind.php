<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID                      = 'invalid';

    // queries.
    case APP_REDIS_QUERY              = 'app_redis_query';

    // mutations.
    case ACTION_APP_INPUT_FORM_UPDATE = 'action_app_input_form_update';
    case ACTION_APP_REDIS_UPDATE      = 'action_app_redis_update';
}
