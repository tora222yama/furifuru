<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Models\App\Trn\TrnGoodJob;
use App\Services\Models\ModelServiceBase;
use Illuminate\Support\Collection;

class TrnGoodJobService extends ModelServiceBase
{
    /**
     * オフセットページネーション情報の取得.
     *
     * @param  array<mixed>  $with
     * @return array<string, mixed>
     */
    public function offsetPagination(
        int $index,
        int $step,
        array $with = []
    ): array {
        // リスト取得.
        /** @var Collection<int, TrnGoodJob> $trnGoodJobList */
        $trnGoodJobList      = TrnGoodJob::query()
            ->with($with)
            ->alive()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->offset($index * $step)
            ->limit($step)
            ->get();

        // カウント取得.
        $trnGoodJobListCount = TrnGoodJob::count();

        return [
            'list'  => $trnGoodJobList->map(function (TrnGoodJob $trnGoodJob) use ($with) {
                return $trnGoodJob->toPayload($with);
            })->toArray(),
            'count' => $trnGoodJobListCount,
        ];
    }
}
