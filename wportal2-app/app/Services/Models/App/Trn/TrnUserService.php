<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Constant;
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeAppPersonalSettingEditUpdate;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnUser;
use App\Services\Models\ModelServiceBase;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TrnUserService extends ModelServiceBase
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
        // 個人設定の更新.
        $trnUser           = $this->findByIdOrFail($pipe->trnUserId);
        $trnUser->nickname = $pipe->nickname;

        // 画像の更新.
        if ($pipe->upload !== null) {
            // 古い画像の削除.
            Storage::disk('storage')->delete($trnUser->face_image_path);

            // 画像の登録処理.
            $ext                      = $pipe->upload->extension();
            $name                     = "$trnUser->id.$ext";
            Storage::disk('storage')->putFileAs(Constant::FACE_IMAGE_S3_PATH, $pipe->upload, $name);

            // ファイルパスの更新.
            $trnUser->face_image_path = Constant::FACE_IMAGE_S3_PATH.$name;
        }

        // 保存.
        $this->updateOrFail($trnUser);
    }

    /**
     * 全て取得.
     */
    public function list(array $with = []): Collection
    {
        return TrnUser::query()
            ->with($with)
            ->alive()
            ->get();
    }

    /**
     * IDで検索(orFail).
     */
    public function findByIdOrFail(int $id): ?TrnUser
    {
        return TrnUser::query()
            ->alive()
            ->findOrFail($id);
    }

    /**
     * 認証ユーザーIDで検索.
     */
    public function findByAuthId(int $authId): ?TrnUser
    {
        return TrnUser::query()
            ->where('auth_id', $authId)
            ->alive()
            ->first();
    }

    /**
     * 認証ユーザーIDで検索.
     */
    public function findByAuthIdOrFail(int $authId): TrnUser
    {
        return TrnUser::query()
            ->where('auth_id', $authId)
            ->alive()
            ->firstOrFail();
    }

    /**
     * 認証成功時にユーザーの作成を行う
     *
     *
     * @throws Throwable
     */
    public function createNewUser(AuthUser $authUser, string $temporaryName, int $id = 0): void
    {
        // ユーザーを作成.
        $trnUser                  = new TrnUser();
        if ($id !== 0) {
            $trnUser->id   = $id;
        }
        $trnUser->auth_id         = $authUser->id;
        $trnUser->nickname        = $temporaryName;
        $trnUser->saveOrFail();

        // 初期画像を保存.
        $defaultPath              = $this->createDefaultFaceImagePath();
        $file                     = Storage::disk('local')->get($defaultPath);
        $ext                      = pathinfo($defaultPath, PATHINFO_EXTENSION);
        $path                     = Constant::FACE_IMAGE_S3_PATH."$trnUser->id.$ext";
        Storage::disk('storage')->put($path, $file);

        // 画像パスを保存.
        $trnUser->face_image_path = $path;
        $trnUser->saveOrFail();
    }

    /**
     * 初期イメージのパス取得.
     *
     * @throws Exception
     */
    public function createDefaultFaceImagePath(): string
    {
        $index = random_int(Constant::FACE_IMAGE_DEFAULT_INDEX_MIN, Constant::FACE_IMAGE_DEFAULT_INDEX_MAX);

        return sprintf(Constant::FACE_IMAGE_DEFAULT, $index);
    }
}
