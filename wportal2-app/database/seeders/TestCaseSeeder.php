<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Constant;
use App\Facades\Models\App\Trn\TrnUserService;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnDivision;
use App\Models\App\Trn\TrnDivisionUser;
use App\Models\App\Trn\TrnProject;
use App\Models\App\Trn\TrnProjectUser;
use App\Models\App\Trn\TrnUser;
use App\Models\App\Trn\TrnUserDivisionPriority;
use App\Models\App\Trn\TrnUserProjectPriority;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Helper\ProgressBar;

class TestCaseSeeder extends Seeder
{
    private ?ProgressBar $pb    = null;

    private string $pbModelName = '';

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
        TrnProject::truncate();
        TrnProjectUser::truncate();

        $instance = $this;

        // メンバー作成.
        $this->beginFactory('TrnUser', 400);
        TrnUser::factory(400)->create()->each(static function (TrnUser $trnUser) use ($instance) {
            // 初期画像を保存.
            $defaultPath              = TrnUserService::createDefaultFaceImagePath();
            $file                     = Storage::disk('local')->get($defaultPath);
            $ext                      = pathinfo($defaultPath, PATHINFO_EXTENSION);
            $path                     = Constant::FACE_IMAGE_S3_PATH."$trnUser->id.$ext";
            Storage::disk('storage')->put($path, $file);

            // 画像パスを保存.
            $trnUser->face_image_path = $path;
            $trnUser->saveOrFail();

            // プロジェクト優先度作成.
            TrnUserProjectPriority::factory(10)
                ->sequence(function (Sequence $sequence) {
                    return [
                        'trn_project_id' => $sequence->index + 1,
                    ];
                })
                ->create([
                    'trn_user_id' => $trnUser->id,
                ]);

            // 課優先度作成.
            TrnUserDivisionPriority::factory(10)
                ->sequence(function (Sequence $sequence) {
                    return [
                        'trn_division_id' => $sequence->index + 1,
                    ];
                })
                ->create([
                    'trn_user_id' => $trnUser->id,
                ]);

            $instance->advanceFactory();
        });

        $this->endFactory();

        // 課作成.
        $this->beginFactory('TrnDivision', 20);
        TrnDivision::factory(20)
            ->create()->each(static function (TrnDivision $trnDivision) use ($instance) {
                for ($i = (($trnDivision->id-1) * 20); $i < $trnDivision->id * 20; $i++) {
                    TrnDivisionUser::factory()->create([
                        'trn_division_id' => $trnDivision->id,
                        'trn_user_id'     => $i + 1,
                    ]);
                }

                $instance->advanceFactory();
            });

        $this->endFactory();

        // プロジェクト作成.
        $this->beginFactory('TrnProject', 20);
        TrnProject::factory(20)
            ->create()->each(function (TrnProject $trnProject) use ($instance) {
                for ($i = (($trnProject->id-1) * 20); $i < $trnProject->id * 20; $i++) {
                    TrnProjectUser::factory()->create([
                        'trn_project_id'  => $trnProject->id,
                        'trn_user_id'     => $i + 1,
                    ]);
                }
                $instance->advanceFactory();
            });

        $this->endFactory();

        $this->command->info('******* initialize done. ********');
    }

    /**
     * 生成ブロックの開始.
     */
    private function beginFactory(string $modelName, int $count): void
    {
        $this->pbModelName = $modelName;
        $this->command->info("begin: $this->pbModelName");
        $this->pb          = $this->command->getOutput()->createProgressBar($count);
    }

    /**
     * 生成ブロックの進行.
     */
    private function advanceFactory(int $step = 1): void
    {
        $this->pb?->advance($step);
    }

    /**
     * 生成ブロックの終了.
     */
    private function endFactory(): void
    {
        $this->pb?->finish();
        $this->command->info(" done: $this->pbModelName");
    }
}
