<?php

declare(strict_types=1);

namespace App\Services\Models\App\Auth;

use App\Enum\App\EEnableFlag;
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use App\Pipe\App\PipeAppLegacyLogin;
use App\Pipe\App\PipeAppUserCreate;
use App\Pipe\App\PipeAppUserUpdate;
use App\Services\Models\ModelServiceBase;
use Carbon\Carbon;
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
                EPipeKind::APP_USER_CREATE                  => $this->execAppUserCreate($pipe),
                EPipeKind::APP_USER_UPDATE                  => $this->execAppUserUpdate($pipe),
                EPipeKind::APP_LEGACY_LOGIN                 => $this->execAppLegacyLogin($pipe),
                default                                     => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Exception
     */
    private function execAppUserCreate(
        PipeAppUserCreate|PipeBase $pipe
    ): void {
        // 新規認証ユーザーを追加.
        $new                   = new AuthUser();
        $new->name             = $pipe->name;
        $new->email            = $pipe->email;
        $new->password         = substr(bin2hex(random_bytes(16)), 0, 16);
        $new->google_id        = '';

        $this->insertOrFail($new);

        // 作成した認証ユーザーをパイプに保存.
        $pipe->createdAuthUser = $new;
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
     * @throws Exception
     */
    private function execAppLegacyLogin(
        PipeAppLegacyLogin|PipeBase $pipe
    ): void {
        if (is_null($pipe->targetAuthUser)) {
            throw new Exception();
        }

        // ワンタイムパスワードの作成(6桁数値).
        $max                                            = 10** 6 - 1;
        $min                                            = 10** 5;
        $onetimePassword                                = (string) random_int($min, $max);

        // ワンタイムパスワードの有効期限.
        $expired                                        = Carbon::now()->addMinutes(10);

        // ワンタイムパスワード&期限の更新.
        $pipe->targetAuthUser->onetime_password         = $onetimePassword;
        $pipe->targetAuthUser->onetime_password_expired = $expired;
        $this->updateOrFail($pipe->targetAuthUser);
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
