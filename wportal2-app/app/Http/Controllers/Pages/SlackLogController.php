<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\External\SlackService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class SlackLogController extends Controller
{
    public function invoke(): Response
    {
        // 表示用ファイルパス.
        $filePath = str_replace(app_path(), '', __FILE__);

        // Noticeチャンネルへの通知.
        SlackService::notifyNotice('wportal2のNoticeテストメッセージ', '指定タイトル', $filePath);

        // Errorチャンネルへの通知.
        SlackService::notifyError('wportal2のErrorテストメッセージ', '指定タイトル', $filePath);

        // 標準ログの出力.
        Log::info('wportal2のLaravel標準ログ');

        // 標準エラーログの出力.
        Log::error('wportal2のLaravelエラーログ');

        return $this->render('IndexProvider/SlackLogIndex');
    }
}
