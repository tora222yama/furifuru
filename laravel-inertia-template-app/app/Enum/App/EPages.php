<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ページ種別.
 * routingと1vs1対応
 */
enum EPages: string
{
    case INVALID = 'invalid';   // 無効.
    case DASHBOARD = 'dashboard'; // ダッシュボード.
    case MVC_VALUE = 'mvc_value'; // MVC値渡し.
    case INPUT_FORM = 'input_form'; // 入力フォーム.
    case REDIS = 'redis'; // Redis操作.
    case SLACK_LOG = 'slack_log'; // Slackログ通知.
    case HEALTH_CHECK = 'health_check'; // ヘルスチェック.

    /**
     * routing時のinvokeパスの取得.
     */
    public function getInvokePath(): string
    {
        return match ($this) {
            self::MVC_VALUE => '\App\Http\Controllers\Pages\MvcValueController@invoke',
            self::INPUT_FORM => '\App\Http\Controllers\Pages\InputFormController@invoke',
            self::REDIS => '\App\Http\Controllers\Pages\RedisController@invoke',
            self::SLACK_LOG => '\App\Http\Controllers\Pages\SlackLogController@invoke',
            self::HEALTH_CHECK => '\App\Http\Controllers\Pages\HealthCheckController@invoke',
            default => '\App\Http\Controllers\Pages\DashboardController@invoke'
        };
    }
}
