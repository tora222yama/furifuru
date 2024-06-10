<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnProjectUserService;
use App\Pipe\App\PipeAppProjectUserUpdate;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AppProjectUserUpdate
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
            new PipeAppProjectUserUpdate($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 所属メンバーの更新.
            TrnProjectUserService::updateByPipe();
        });

        return PipeService::getResult();
    }
}
