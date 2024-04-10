<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

use App\Facades\Internal\PipeService;
use App\GraphQL\App\Queries\Pipe\PipeAppRedisQuery;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class AppRedisQuery
{
    public const REDIS_QUERY_STORE_KEY = 'redis_query_store_key';

    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // パイプ作成.
        /** @var PipeAppRedisQuery $pipe */
        $pipe       = PipeService::insertNewPipe(
            new PipeAppRedisQuery($args)
        );

        // サンプル表示.
        Log::info('引数 => '.$pipe->sampleArgument);

        // キャッシュ（redis）から値取得.
        $storeValue = Cache::get(self::REDIS_QUERY_STORE_KEY, function () {
            return '[未設定]';
        });

        return [
            'store_value' => $storeValue,
        ];
    }
}
