<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Pipe\App\PipeAppPersonalSettingSpConfirmCode;
use Illuminate\Support\Facades\Log;
use Throwable;

final class AppPersonalSettingSpConfirmCode
{
    /**
     * @throws Throwable
     */
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        localSleep();

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppPersonalSettingSpConfirmCode($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        Log::info('ここで2FAログインの最終確認とする.');

        return PipeService::getResult();
    }
}
