<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Enum\App\EStatusCode;
use Exception;
use Illuminate\Support\Facades\Log;

final class ActionAppLoginFormCheck
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        Log::info('チェック処理を通過');

        return [
            'status_code'    => EStatusCode::OK->value,
            'status_message' => '',
            'errors'         => json_encode([]),
        ];
    }
}
