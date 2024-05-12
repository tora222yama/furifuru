<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnDivisionService;
use App\GraphQL\App\Mutations\Pipe\PipeAppDivisionUpdate;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AppDivisionUpdate
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
            new PipeAppDivisionUpdate($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 課情報の更新.
            TrnDivisionService::updateByPipe();
        });

        return PipeService::getResult();
    }
}
