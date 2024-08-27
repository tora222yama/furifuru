<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Pipe\App\PipeAppPersonalSettingSpPassword;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final class AppPersonalSettingSpPassword
{
    /**
     * @throws Throwable
     */
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        localSleep();

        // パイプ作成.
        /** @var PipeAppPersonalSettingSpPassword $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeAppPersonalSettingSpPassword($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult([
                'url' => '',
            ]);
        }

        // 更新処理.
        DB::transaction(static function () {
            // TODO: auth_userのpasswordを更新する.
        });

        Log::info('password:'.$pipe->password);
        Log::info('ここでQRのURLを発行する');

        return PipeService::getResult([
            'url' => 'http://localhost:9190',
        ]);
    }
}
