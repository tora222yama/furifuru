<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\GraphQL\App\Queries\RedisQuery;
use Illuminate\Support\Facades\Cache;
use Psr\SimpleCache\InvalidArgumentException;

final class ActionAppRedisUpdate
{
    /**
     * @throws InvalidArgumentException
     */
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // キャッシュに値を保存.
        // TODO: Pipeサービスも用意してしまう.
        $storeValue = (string) $args['store_value'];
        Cache::set(RedisQuery::REDIS_QUERY_STORE_KEY, $storeValue, 3600);

        return [
            'status_code' => 200,
            'status_message' => '',
            'errors' => json_encode([]),
        ];
    }
}
