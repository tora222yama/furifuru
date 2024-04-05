<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeActionAppInputFormUpdate;

final class ActionAppInputFormUpdate
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // パイプ作成.
        PipeService::insertNewPipe(new PipeActionAppInputFormUpdate($args));

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        return [
            'status_code'    => 200,
            'status_message' => '',
            'errors'         => json_encode([]),
        ];
    }
}
