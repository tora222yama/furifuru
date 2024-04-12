<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Enum\App\EStatusCode;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeAppLoginFormLogin;
use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Auth;

final class AppLoginFormLogin
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppLoginFormLogin($args)
        );

        // ユーザーを強制的に取得.
        $authUser = AuthUser::query()
            ->where('name', 'template')
            ->firstOrFail();

        // 強制的にログイン.
        Auth::login($authUser, true);

        return [
            'status_code'    => EStatusCode::OK->value,
            'status_message' => '',
            'errors'         => json_encode([]),
        ];
    }
}
