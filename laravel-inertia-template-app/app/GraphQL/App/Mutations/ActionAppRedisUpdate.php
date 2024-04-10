<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Enum\App\EStatusCode;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeActionAppRedisUpdate;
use App\GraphQL\App\Queries\AppRedisQuery;
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

        // パイプ作成.
        /** @var PipeActionAppRedisUpdate $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeActionAppRedisUpdate($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        // キャッシュに値を保存.
        Cache::set(AppRedisQuery::REDIS_QUERY_STORE_KEY, $pipe->storeValue, 3600);

        return [
            'status_code'    => EStatusCode::OK->value,
            'status_message' => '',
            'errors'         => json_encode([]),
        ];
    }
}
