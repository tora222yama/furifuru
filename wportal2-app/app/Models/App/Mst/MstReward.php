<?php

declare(strict_types=1);

namespace App\Models\App\Mst;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MstReward extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'mst_reward';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'              => $this->id,
            'reward_kind'     => $this->reward_kind,
            'reward_rank'     => $this->reward_rank,
            'reward_name'     => $this->reward_name,
            'reward_gold'     => $this->reward_gold,
            'reward_exp'      => $this->reward_exp,
            'e_enable_repeat' => $this->e_enable_repeat,
        ];
    }
}
