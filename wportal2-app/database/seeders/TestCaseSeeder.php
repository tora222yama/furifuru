<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Constant;
use App\Facades\Models\App\Trn\TrnUserService;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnDivision;
use App\Models\App\Trn\TrnDivisionUser;
use App\Models\App\Trn\TrnUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

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
        TrnUser::truncate();
        TrnDivision::truncate();
        TrnDivisionUser::truncate();

        // メンバー作成.
        TrnUser::factory(400)->create()->each(static function (TrnUser $trnUser) {
            // 初期画像を保存.
            $defaultPath              = TrnUserService::createDefaultFaceImagePath();
            $file                     = Storage::disk('local')->get($defaultPath);
            $ext                      = pathinfo($defaultPath, PATHINFO_EXTENSION);
            $path                     = Constant::FACE_IMAGE_S3_PATH."$trnUser->id.$ext";
            Storage::disk('storage')->put($path, $file);

            // 画像パスを保存.
            $trnUser->face_image_path = $path;
            $trnUser->saveOrFail();
        });

        // 課作成.
        TrnDivision::factory(20)
            ->create()->each(static function (TrnDivision $trnDivision) {
                for ($i = (($trnDivision->id-1) * 20); $i < $trnDivision->id * 20; $i++) {
                    TrnDivisionUser::factory()->create([
                        'trn_division_id' => $trnDivision->id,
                        'trn_user_id'     => $i + 1,
                    ]);
                }
            });

        $this->command->info('******* initialize done. ********');
    }
}
