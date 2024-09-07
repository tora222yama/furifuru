<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnUserReward extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user_reward';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'                => $this->id                               ?? 0,
            'mstRewardId'       => $this->mst_reward_id                    ?? 0,
            'achievementCount'  => $this->achievement_count                ?? 0,
            'receivedCount'     => $this->received_count                   ?? 0,
            'createdAt'         => $this->created_at                       ?? '',
            'updatedAt'         => $this->updated_at                       ?? '',
        ];
    }
}
