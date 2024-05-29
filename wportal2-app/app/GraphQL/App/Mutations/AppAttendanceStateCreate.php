<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations;

use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnAttendanceStateService;
use App\Pipe\App\PipeAppAttendanceStateCreate;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AppAttendanceStateCreate
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
            new PipeAppAttendanceStateCreate($args)
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 出退勤状態の作成.
            TrnAttendanceStateService::updateByPipe();

            // TODO: Slackへの通知
        });

        return PipeService::getResult();
    }
}
