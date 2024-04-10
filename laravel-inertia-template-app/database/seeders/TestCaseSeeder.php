<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnFacility;
use Database\Factories\App\Auth\AuthUserFactory;
use Database\Factories\App\Trn\TrnFacilityFactory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class TestCaseSeeder extends Seeder
{
    /**
     * ローカル/テストケース向けの初期データを用意する.
     */
    public function run(): void
    {
        $this->command->info('******* initialize local/test data. ********');

        // local/tst/dev環境でなければ初期化実行不可.
        if (! (isLocal() || isTst() || isDev())) {
            $this->command->info('!!! caution local/tst/dev environment only. !!!');

            return;
        }

        // データの削除.
        AuthUser::truncate();
        TrnFacility::truncate();

        // ユーザーデータの追加.
        (new AuthUserFactory())
            ->create([
                'name'     => 'template',
                'email'    => 'template@919.jp',
                'password' => 'template',
            ]);

        // 施設データの追加.
        (new TrnFacilityFactory())
            ->count(20)
            ->sequence(function (Sequence $sequence) {
                return [
                    'category_id' => ($sequence->index + 1) * 100,
                ];
            })
            ->create();

        $this->command->info('******* initialize done. ********');
    }
}
