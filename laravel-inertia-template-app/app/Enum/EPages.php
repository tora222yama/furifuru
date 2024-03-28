<?php

declare(strict_types=1);

namespace App\Enum;

enum EPages: string
{
    case DASHBOARD = 'dashboard';
    case REDIS = 'redis';
    case SLACK_LOG = 'slack_log';
    case FIRST_PAGE = 'first_page';
    case HEALTH_CHECK = 'health_check';

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::SLACK_LOG => '\App\Http\Controllers\Pages\SlackLogController@invoke',
            self::REDIS => '\App\Http\Controllers\Pages\RedisController@invoke',
            self::FIRST_PAGE => '\App\Http\Controllers\Pages\FirstPageController@invoke',
            self::HEALTH_CHECK => '\App\Http\Controllers\Pages\HealthCheckController@invoke',
            default => '\App\Http\Controllers\Pages\DashboardController@invoke'
        };
    }
}
