<?php

declare(strict_types=1);

namespace App\Services\Models\App\Mst;

use App\Models\App\Mst\MstReward;
use App\Services\Models\ModelServiceBase;

class MstRewardService extends ModelServiceBase
{
    /**.
     * オフセットページネーション情報の取得.
     */
    public function offsetPagination(
        int $index,
        int $step,
        array $with = [],
    ): array {
        // リスト取得.
        $mstRewardList      = MstReward::query()
            ->with($with)
            ->alive()
            ->offset($index * $step)
            ->limit($step)
            ->get();

        // カウント取得.
        $mstRewardListCount = MstReward::query()
            ->alive()
            ->count();

        return [
            'list'  => $mstRewardList->map(function (MstReward $mstReward) use ($with) {
                return $mstReward->toPayload($with);
            })->toArray(),
            'count' => $mstRewardListCount,
        ];
    }
}
