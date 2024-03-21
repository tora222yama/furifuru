<?php

declare(strict_types=1);

namespace App\Logging;

//use App\Models\Scat\Auth\AuthUser;
//use Auth;
use Monolog\Logger;
use Monolog\Processor\IntrospectionProcessor;
use Monolog\Processor\ProcessIdProcessor;
use Monolog\Processor\WebProcessor;

class CustomizeFormatter
{
    /**
     * 渡されたloggerをカスタマイズする
     *
     * @return void
     */
    public function __invoke($logger)
    {
        $formatter = new JsonCustomizeFormatter();
        $formatter->includeStacktraces();

        // extraフィールドを追加
        $backtrace = new IntrospectionProcessor(Logger::DEBUG, ['Illuminate\\']);
        // extraフィールドにurl, ip, http_method, server, referrer追加
        $wp = new WebProcessor();
        // extraフィールドにprocess_id追加
        $pid = new ProcessIdProcessor();

        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter($formatter);
            $handler->pushProcessor($backtrace);
            $handler->pushProcessor($wp);
            $handler->pushProcessor($pid);
            // extraにオリジナル項目追加
            // $handler->pushProcessor([$this, 'addAuthID']);
        }
    }

    /**
     * 認証IDをログ出力に付加
     */
    //    public function addAuthID(array $record): array
    //    {
    //        /** @var AuthUser $auth */
    //        $auth = Auth::user();
    //
    //        $authId = $auth ? $auth->id : '';
    //        $record['extra']['auth_id'] = $authId;
    //
    //        return $record;
    //    }
}
