<?php

declare(strict_types=1);

namespace App\Services\Models\App\Auth;

use App\Enum\App\EEnableFlag;
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use App\Pipe\App\PipeAppUserUpdate;
use App\Services\Models\ModelServiceBase;
use Exception;
use Throwable;

class AuthUserService extends ModelServiceBase
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
                EPipeKind::APP_USER_UPDATE                  => $this->execAppUserUpdate($pipe),
                default                                     => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppUserUpdate(
        PipeAppUserUpdate|PipeBase $pipe
    ): void {
        $authUser                        = $this->findByIdOrFail($pipe->authId);

        // レガシーログイン許可の更新.
        $authUser->e_enable_legacy_login = $pipe->enableLegacyLogin
            ? EEnableFlag::ENABLE->value : EEnableFlag::INVALID->value;

        // 許可かつ空文字でない場合はパスワードの更新.
        if ($pipe->enableLegacyLogin && ! empty($pipe->overwritePassword)) {
            $authUser->password = $pipe->overwritePassword;
        }

        // 更新の実施.
        $this->updateOrFail($authUser);
    }

    /**
     * IDで検索(orFail).
     */
    public function findByIdOrFail(int $id, array $with = []): ?AuthUser
    {
        return AuthUser::query()
            ->with($with)
            ->findOrFail($id);
    }
}
