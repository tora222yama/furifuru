<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Constant;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnUser;
use Exception;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TrnUserService
{
    /**
     * パイプによる更新.
     *
     * @throws Throwable
     */
    public function updateByPipe(): void
    {
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
