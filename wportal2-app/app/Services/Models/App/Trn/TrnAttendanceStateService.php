<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeAppAttendanceStateCreate;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnAttendanceState;
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
                EPipeKind::APP_ATTENDANCE_STATE_CREATE      => $this->execAppAttendanceStateCreate($pipe),
                default                                     => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppAttendanceStateCreate(
        PipeAppAttendanceStateCreate|PipeBase $pipe
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
}
