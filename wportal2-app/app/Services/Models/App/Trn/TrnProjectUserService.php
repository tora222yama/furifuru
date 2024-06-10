<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnProjectUser;
use App\Pipe\App\PipeAppProjectUserUpdate;
use App\Services\Models\ModelServiceBase;
use Exception;
use Illuminate\Support\Facades\Log;
use Throwable;

class TrnProjectUserService extends ModelServiceBase
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
                EPipeKind::APP_PROJECT_USER_UPDATE  => $this->execAppProjectUserUpdate($pipe),
                default                             => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppProjectUserUpdate(
        PipeAppProjectUserUpdate|PipeBase $pipe
    ): void {
        // 現在の配列.
        $oldUserList = TrnProjectUser::query()
            ->where('trn_project_id', $pipe->trnProjectId)
            ->pluck('trn_user_id');

        // 追加する対象.
        $addUserList = $pipe->trnUserIdList->diff($oldUserList)->values();
        $addUserList->each(function (int $trnUserId) use ($pipe) {
            $addUser                  = new TrnProjectUser();
            $addUser->trn_project_id  = $pipe->trnProjectId;
            $addUser->trn_user_id     = $trnUserId;
            $addUser->saveOrFail();
        });

        // 削除する対象.
        $delUserList = $oldUserList->diff($pipe->trnUserIdList);
        if (! $delUserList->isEmpty()) {
            TrnProjectUser::query()
                ->where('trn_project_id', $pipe->trnProjectId)
                ->whereIn('trn_user_id', $delUserList)
                ->delete();
        }

        // ログ出力.
        $delLog      = json_encode($delUserList->toArray());
        $addLog      = json_encode($addUserList->toArray());
        Log::info("execAppProjectUserUpdate del:$delLog add:$addLog");
    }
}
