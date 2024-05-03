<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeAppPersonalSettingEditUpdate;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnUserSlackProfile;
use App\Services\Models\ModelServiceBase;
use Exception;
use Throwable;

class TrnUserSlackProfileService extends ModelServiceBase
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
                EPipeKind::APP_PERSONAL_SETTING_EDIT_UPDATE => $this->execAppPersonalSettingEditUpdate($pipe),
                default                                     => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppPersonalSettingEditUpdate(
        PipeAppPersonalSettingEditUpdate|PipeBase $pipe
    ): void {
        // 更新もしくは生成.
        $trnUserSlackProfile = $this->findByTrnUserId($pipe->trnUserId);
        if (is_null($trnUserSlackProfile)) {
            $trnUserSlackProfile                  = new TrnUserSlackProfile();
            $trnUserSlackProfile->trn_user_id     = $pipe->trnUserId;
            $trnUserSlackProfile->slack_user_id   = $pipe->slackUserId;
            $trnUserSlackProfile->slack_user_name = $pipe->slackUserName;
            $trnUserSlackProfile->slack_team_id   = $pipe->slackTeamId;
            $this->insertOrFail($trnUserSlackProfile);
        } else {
            $trnUserSlackProfile->slack_user_id   = $pipe->slackUserId;
            $trnUserSlackProfile->slack_user_name = $pipe->slackUserName;
            $trnUserSlackProfile->slack_team_id   = $pipe->slackTeamId;
            $this->updateOrFail($trnUserSlackProfile);
        }
    }

    /**
     * ユーザーIDによる検索.
     */
    public function findByTrnUserId(int $trnUserId): ?TrnUserSlackProfile
    {
        return TrnUserSlackProfile::query()
            ->where('trn_user_id', $trnUserId)
            ->alive()
            ->first();
    }
}
