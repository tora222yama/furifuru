<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Logger;
use Monolog\Processor\IntrospectionProcessor;

class LogDebugProcessor
{
    public function __invoke($logging)
    {
        /* プロセッサーを作成 */
        $introspectionProcessor = new IntrospectionProcessor(
            Logger::DEBUG,
            [],
            4
        );
        /* ログの各ハンドラにプロセッサーを設定する */
        foreach ($logging->getHandlers() as $handler) {
            $handler->pushProcessor($introspectionProcessor);
        }
    }
}
