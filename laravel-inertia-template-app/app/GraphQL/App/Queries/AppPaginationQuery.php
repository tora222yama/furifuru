<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

use App\Facades\Internal\PipeService;
use App\GraphQL\App\Queries\Pipe\PipeAppPaginationQuery;
use App\Models\App\Trn\TrnFacility;

final class AppPaginationQuery
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // パイプ作成.
        /** @var PipeAppPaginationQuery $pipe */
        $pipe                 = PipeService::insertNewPipe(
            new PipeAppPaginationQuery($args)
        );

        // TODO: サービス化.
        $trnFacilityList      = TrnFacility::query()
            ->offset($pipe->pageIndex * $pipe->pageStep)
            ->limit($pipe->pageStep)
            ->get();

        // TODO: サービス化.
        $trnFacilityListCount = TrnFacility::count();

        return [
            'list'  => $trnFacilityList->map(function (TrnFacility $trnFacility) {
                return $trnFacility->toPayload();
            })->toArray(),
            'count' => $trnFacilityListCount,
        ];
    }
}
