<?php

declare(strict_types=1);

namespace Database\Seeders\Batch\Mst\Init\App;

use App\Enum\App\EGoodsCategory;
use App\Enum\Mst\EMstGoods;
use App\Models\App\Mst\MstGoods;
use Illuminate\Database\Seeder;

class Seeder_MstGoods extends Seeder
{
    const DATA_ARRAY = [
        [
            'id'         => EMstGoods::LUNCH_TICKET_TOBARU_LOW->value,
            'name'       => 'Eng課長と行くお手頃1on1ランチ',
            'explain'    => 'Eng課長がお手頃価格のランチにご招待！\n購入時にrakumoブロックを行います。',
            'category'   => EGoodsCategory::LUNCH_TICKET->value,
            'image_path' => 'image/goods0001.png',
            'price'      => 200,
        ],
        [
            'id'         => EMstGoods::LUNCH_TICKET_TOBARU_MIDDLE->value,
            'name'       => 'Eng課長と行く高級1on1ランチ',
            'explain'    => 'Eng課長が高級ランチにご招待！\n購入時にrakumoブロックを行います。',
            'category'   => EGoodsCategory::LUNCH_TICKET->value,
            'image_path' => 'image/goods0002.png',
            'price'      => 500,
        ],
        [
            'id'         => EMstGoods::LUNCH_TICKET_TOBARU_HIGH->value,
            'name'       => 'Eng課長の本気1on1ランチ',
            'explain'    => 'Eng課長が全力をだしたら！？\n購入時にrakumoブロックを行います。',
            'category'   => EGoodsCategory::LUNCH_TICKET->value,
            'image_path' => 'image/goods0003.png',
            'price'      => 1000,
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::DATA_ARRAY as $data) {
            $model = new MstGoods();
            foreach ($data as $key => $value) {
                $model->$key = $value;
            }
            $model->save();
        }
    }
}
