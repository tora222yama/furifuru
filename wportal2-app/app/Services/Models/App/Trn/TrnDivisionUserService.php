<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnDivisionUser;
use App\Pipe\App\PipeAppDivisionUserUpdate;
use App\Services\Models\ModelServiceBase;
use Exception;
use Illuminate\Support\Facades\Log;
use Throwable;

class TrnDivisionUserService extends ModelServiceBase
{
    /**
     * パイプによる更新.
     *
     * @throws Throwable
     */
    public function updateByPipe(): void
    {
        foreach (PipeService::getPipes(__CLASS__) as $pipe) {
            $kind = $pipe->getKind();
            match ($kind) {
                EPipeKind::APP_DIVISION_USER_UPDATE => $this->execAppDivisionUserUpdate($pipe),
                default                             => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppDivisionUserUpdate(
        PipeAppDivisionUserUpdate|PipeBase $pipe
    ): void {
        // 現在の配列.
        $oldUserList = TrnDivisionUser::query()
            ->where('trn_division_id', $pipe->trnDivisionId)
            ->pluck('trn_user_id');

        // 追加する対象.
        $addUserList = $pipe->trnUserIdList->diff($oldUserList)->values();
        $addUserList->each(function (int $trnUserId) use ($pipe) {
            $addUser                  = new TrnDivisionUser();
            $addUser->trn_division_id = $pipe->trnDivisionId;
            $addUser->trn_user_id     = $trnUserId;
            $addUser->saveOrFail();
        });

        // 削除する対象.
        $delUserList = $oldUserList->diff($pipe->trnUserIdList);
        if (! $delUserList->isEmpty()) {
            TrnDivisionUser::query()
                ->where('trn_division_id', $pipe->trnDivisionId)
                ->whereIn('trn_user_id', $delUserList)
                ->delete();
        }

        // ログ出力.
        $delLog      = json_encode($delUserList->toArray());
        $addLog      = json_encode($addUserList->toArray());
        Log::info("execAppDivisionUserUpdate del:$delLog add:$addLog");
    }
}
