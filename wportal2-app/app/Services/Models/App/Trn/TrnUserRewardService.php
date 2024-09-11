<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnUserReward;
use App\Pipe\App\PipeAppRewardAchieve;
use App\Pipe\PipeBase;
use App\Services\Models\ModelServiceBase;
use Exception;
use Illuminate\Support\Collection;
use Throwable;

class TrnUserRewardService extends ModelServiceBase
{
    /**
     * パイプによる更新.
     *
     * @throws Throwable
     */
    public function updateByPipe(): void
    {
        foreach (PipeService::getPipes(__CLASS__) as $pipe) {
            $kind = $pipe->getKind();
            match ($kind) {
                EPipeKind::APP_REWARD_ACHIEVE => $this->execAppRewardAchieve($pipe),
                default                       => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * 報酬の達成.
     *
     * @throws Exception
     */
    private function execAppRewardAchieve(
        PipeAppRewardAchieve|PipeBase $pipe
    ): void {
        // 対象となる報酬を取得.
        $targetReward = TrnUserReward::query()
            ->where('trn_user_id', $pipe->authUser->TrnUser->id)
            ->whereIn('id', $pipe->trnUserRewardIdList)
            ->get();

        // 対象のフラグを更新.
        $targetReward->each(function (TrnUserReward $trnUserReward) {
            $trnUserReward->received_count = $trnUserReward->achievement_count;
            $this->updateOrFail($trnUserReward);
        });
    }

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

    /**
     * 達成可能な報酬をリストで取得.
     */
    public function listAchievable(
        int $trnUserId,
        int $trnUserRewardId,
        array $with = [],
    ): Collection {
        return TrnUserReward::query()
            ->where('trn_user_id', $trnUserId)
            ->where('achievement_count', '>', 'received_count')
            ->when($trnUserRewardId, fn ($query) => $query->where('id', $trnUserRewardId))
            ->with($with)
            ->alive()
            ->get();
    }

    /**
     * 達成可能な報酬の数を取得.
     */
    public function countAchievable(
        ?AuthUser $authUser,
    ): int {
        if (is_null($authUser)) {
            return 0;
        }

        // TODO: キャッシュ化を検討する.

        // 対象となる報酬のリストを取得.
        $trnUserRewardList = TrnUserReward::query()
            ->where('trn_user_id', $authUser->TrnUser->id)
            ->where('achievement_count', '>', 'received_count')
            ->alive()
            ->get();

        return $trnUserRewardList->reduce(function (int $carry, TrnUserReward $trnUserReward) {
            return $carry + ($trnUserReward->achievement_count - $trnUserReward->received_count);
        }, 0);
    }
}
