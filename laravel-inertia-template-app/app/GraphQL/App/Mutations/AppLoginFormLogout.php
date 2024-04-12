<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Enum\App\EStatusCode;
use Exception;
use Illuminate\Support\Facades\Auth;

final class AppLoginFormLogout
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        // 早く完了しないように強制遅延.
        sleep(1);

        // 強制的にログアウト.
        Auth::logout();

        return [
            'status_code'    => EStatusCode::OK->value,
            'status_message' => '',
            'errors'         => json_encode([]),
        ];
    }
}
