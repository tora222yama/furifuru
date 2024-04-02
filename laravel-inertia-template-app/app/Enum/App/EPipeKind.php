<?php

declare(strict_types=1);

namespace App\Enum\App;

enum EPipeKind: string
{
    case INVALID = 'invalid';

    case ACTION_APP_REDIS_UPDATE = 'action_app_redis_update';
}
