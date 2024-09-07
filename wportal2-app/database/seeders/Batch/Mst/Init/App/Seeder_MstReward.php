<?php

declare(strict_types=1);

namespace Database\Seeders\Batch\Mst\Init\App;

use App\Enum\App\EEnableFlag;
use App\Enum\App\ERewardKind;
use App\Models\App\Mst\MstReward;
use Illuminate\Database\Seeder;

class Seeder_MstReward extends Seeder
{
    const DATA_ARRAY = [
        [
            'id'              => 1,
            'reward_kind'     => ERewardKind::DAILY->value,
            'reward_rank'     => 1,
            'reward_name'     => '報酬1',
            'reward_gold'     => 10,
            'reward_exp'      => 10,
            'e_enable_repeat' => EEnableFlag::ENABLE,
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::DATA_ARRAY as $data) {
            $model = new MstReward();
            foreach ($data as $key => $value) {
                $model->$key = $value;
            }
            $model->save();
        }
    }
}
