<?php

declare(strict_types=1);

namespace App\Enum;

enum EPages: string
{
    case DASHBOARD = 'dashboard';
    case MVC_VALUE = 'mvc_value';
    case REDIS = 'redis';
    case SLACK_LOG = 'slack_log';
    case HEALTH_CHECK = 'health_check';

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::MVC_VALUE => '\App\Http\Controllers\Pages\MvcValueController@invoke',
            self::REDIS => '\App\Http\Controllers\Pages\RedisController@invoke',
            self::SLACK_LOG => '\App\Http\Controllers\Pages\SlackLogController@invoke',
            self::HEALTH_CHECK => '\App\Http\Controllers\Pages\HealthCheckController@invoke',
            default => '\App\Http\Controllers\Pages\DashboardController@invoke'
        };
    }
}
