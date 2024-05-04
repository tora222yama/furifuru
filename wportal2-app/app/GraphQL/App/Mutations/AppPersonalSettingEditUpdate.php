<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnUserService;
use App\Facades\Models\App\Trn\TrnUserSlackProfileService;
use App\GraphQL\App\Mutations\Pipe\PipeAppPersonalSettingEditUpdate;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AppPersonalSettingEditUpdate
{
    /**
     * @throws Throwable
     */
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        sleep(1);

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppPersonalSettingEditUpdate($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 個人設定の更新.
            TrnUserService::updateByPipe();

            // Slack情報の更新.
            TrnUserSlackProfileService::updateByPipe();
        });

        return PipeService::getResult();
    }
}
