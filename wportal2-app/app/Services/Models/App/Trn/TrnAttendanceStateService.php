<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EArchiveLevel;
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnAttendanceState;
use App\Pipe\App\PipeAppAttendanceCreate;
use App\Pipe\App\PipeAppAttendanceDelete;
use App\Services\Models\ModelServiceBase;
use Exception;
use Throwable;

class TrnAttendanceStateService extends ModelServiceBase
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
                EPipeKind::APP_ATTENDANCE_CREATE            => $this->execAppAttendanceStateCreate($pipe),
                EPipeKind::APP_ATTENDANCE_DELETE            => $this->execAppAttendanceStateDelete($pipe),
                default                                     => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppAttendanceStateCreate(
        PipeAppAttendanceCreate|PipeBase $pipe
    ): void {
        if (is_null($pipe->authUser)) {
            throw new Exception('invalid auth user.');
        }

        // モデル作成.
        $new                     = new TrnAttendanceState();
        $new->trn_user_id        = $pipe->authUser->TrnUser->id;
        $new->e_attendance_state = $pipe->eAttendanceState->value;

        // 保存
        $this->insertOrFail($new);
    }

    /**
     * @throws Exception
     * @throws Throwable
     */
    private function execAppAttendanceStateDelete(
        PipeAppAttendanceDelete|PipeBase $pipe
    ): void {
        if (is_null($pipe->authUser)) {
            throw new Exception('invalid auth user.');
        }

        // 対象データを取得.
        /** @var TrnAttendanceState $target */
        $target                  = TrnAttendanceState::query()
            ->orderByDesc('created_at')
            ->where('trn_user_id', $pipe->authUser->TrnUser->id)
            ->alive()
            ->firstOrFail();

        // 対象データを削除.
        $target->e_archive_level = EArchiveLevel::ARCHIVE->value;

        // 削除を保存.
        $target->updateOrFail();
    }
}
