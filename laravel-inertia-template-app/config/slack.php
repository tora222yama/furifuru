<?php

declare(strict_types=1);

/**
 * Slackの設定
 */

return [
    // notice webhook url.
    'NoticeUrl' => env('SLACK_URL_NOTICE', ''),

    // error webhook url.
    'ErrorUrl' => env('SLACK_URL_ERROR', ''),
];
