<?php

declare(strict_types=1);

namespace Database\Seeders\Batch\Mst\Init;

use Database\Seeders\Batch\Mst\BatchSeeder;
use Throwable;

class MstInitReward extends BatchSeeder
{
    /**
     * シードするマスタを定義.
     */
    const MODELS = [];

    /**
     * Run the database seeds.
     *
     * @throws Throwable
     */
    public function run(bool $dryRun): void
    {
        if ($dryRun) {
            $this->command->info('dryRunモードのため、何もせずに処理終了します');

            return;
        }

        ini_set('memory_limit', '2G');

        $this->command->info('begin ['.__CLASS__.']');

        // 実行するコレクションを準備.
        $modelList = collect(self::MODELS);

        // 初期化前にデータ削除を行う.
        $modelList->each(function (string $model) {
            call_user_func([$model, 'truncate']);
        });

        // データ初期化を実施.
        $this->call([]);

        $this->command->info('done ['.__CLASS__.']');
    }
}
