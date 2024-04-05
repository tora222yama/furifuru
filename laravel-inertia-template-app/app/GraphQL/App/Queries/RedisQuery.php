<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

use Illuminate\Support\Facades\Cache;

final class RedisQuery
{
    public const REDIS_QUERY_STORE_KEY = 'redis_query_store_key';

    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // キャッシュ（redis）から値取得.
        $storeValue = Cache::get(self::REDIS_QUERY_STORE_KEY, function () {
            return '[未設定]';
        });

        return [
            'store_value' => $storeValue,
        ];
    }
}
