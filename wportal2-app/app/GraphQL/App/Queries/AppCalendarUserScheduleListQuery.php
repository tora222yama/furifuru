<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

use App\Facades\Internal\PipeService;
use App\Pipe\App\PipeAppCalendarUserScheduleListQuery;
use Illuminate\Support\Facades\Log;

final class AppCalendarUserScheduleListQuery
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        localSleep();

        // パイプ作成.
        /** @var PipeAppCalendarUserScheduleListQuery $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeAppCalendarUserScheduleListQuery($args)
        );

        Log::info(print_r($pipe->emailList, true));

        return [];
    }
}
