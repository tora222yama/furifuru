<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Models\App\Trn\TrnUserReward;
use App\Services\Models\ModelServiceBase;

class TrnUserRewardService extends ModelServiceBase
{
    /**.
     * オフセットページネーション情報の取得.
     */
    public function offsetPagination(
        int $trnUserId,
        int $index,
        int $step,
        array $with = [],
    ): array {
        // リスト取得.
        $trnUserRewardList      = TrnUserReward::query()
            ->where('trn_user_id', $trnUserId)
            ->with($with)
            ->alive()
            ->offset($index * $step)
            ->limit($step)
            ->get();

        // カウント取得.
        $trnUserRewardListCount = TrnUserReward::query()
            ->where('trn_user_id', $trnUserId)
            ->alive()
            ->count();

        return [
            'list'  => $trnUserRewardList->map(function (TrnUserReward $trnUserReward) use ($with) {
                return $trnUserReward->toPayload($with);
            })->toArray(),
            'count' => $trnUserRewardListCount,
        ];
    }
}
