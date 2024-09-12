<?php

declare(strict_types=1);

namespace Database\Seeders\Batch\Mst\Init\App;

use App\Enum\App\EEnableFlag;
use App\Enum\App\ERewardKind;
use App\Enum\Mst\EMstReward;
use App\Models\App\Mst\MstReward;
use Illuminate\Database\Seeder;

class Seeder_MstReward extends Seeder
{
    const DATA_ARRAY = [
        [
            'id'              => EMstReward::CREATE_ACCOUNT->value,
            'reward_kind'     => ERewardKind::ACHIEVE->value,
            'reward_rank'     => 1,
            'reward_name'     => '華麗なる登場',
            'reward_explain'  => 'アカウントを作成する',
            'reward_gold'     => 100,
            'e_enable_repeat' => EEnableFlag::INVALID->value,
        ],
        [
            'id'              => EMstReward::UPDATE_PROFILE->value,
            'reward_kind'     => ERewardKind::ACHIEVE->value,
            'reward_rank'     => 1,
            'reward_name'     => '前略プロフィール',
            'reward_explain'  => '個人設定を更新する',
            'reward_gold'     => 100,
            'e_enable_repeat' => EEnableFlag::INVALID->value,
        ],
        [
            'id'              => EMstReward::CREATE_PERFECT_ATTENDANCE->value,
            'reward_kind'     => ERewardKind::DAILY->value,
            'reward_rank'     => 1,
            'reward_name'     => '紳士の勤怠',
            'reward_explain'  => "一日の勤怠で出勤・休憩・退勤を行う\n繰り返し獲得できる。一日一回まで。",
            'reward_gold'     => 10,
            'e_enable_repeat' => EEnableFlag::ENABLE->value,
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
