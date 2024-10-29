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
            'id'           => EMstGoods::LUNCH_TICKET_TOBARU_LOW->value,
            'name'         => 'Eng課長と行くお手頃1on1ランチ',
            'explain'      => "Eng課長がお手頃価格のランチにご招待！\n購入時にrakumoブロックを行います。",
            'comment'      => '桃原「在宅は出社に切り替えます」',
            'category'     => EGoodsCategory::LUNCH_TICKET->value,
            'image_path'   => '/image/ticket/lunch_ticket_0001.png',
            'author_email' => 'tobaru-hideyasu@919.jp',
            'price'        => 200,
        ],
        [
            'id'           => EMstGoods::LUNCH_TICKET_YAMADA_LOW->value,
            'name'         => 'SD課長と行くお気軽1on1ランチ',
            'explain'      => "SD課長がお気軽ランチにご招待！\n購入時にrakumoブロックを行います。",
            'comment'      => 'ゆっきー「お気軽にどうぞ！」',
            'category'     => EGoodsCategory::LUNCH_TICKET->value,
            'image_path'   => '/image/ticket/lunch_ticket_0002.png',
            'author_email' => 'yamada-tomoyuki@919.jp',
            'price'        => 200,
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
