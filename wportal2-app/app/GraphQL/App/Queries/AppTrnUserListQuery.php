<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

use App\Facades\Models\App\Trn\TrnUserService;
use App\Models\App\Trn\TrnUser;

final class AppTrnUserListQuery
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        localSleep();

        $trnUserList = TrnUserService::list();

        return $trnUserList->map(function (TrnUser $trnUser) {
            return $trnUser->toPayload();
        })->toArray();
    }
}
