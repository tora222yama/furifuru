<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EArchiveLevel;
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnProject;
use App\Pipe\App\PipeAppProjectDelete;
use App\Pipe\App\PipeAppProjectUpdate;
use App\Services\Models\ModelServiceBase;
use Exception;
use Throwable;

class TrnProjectService extends ModelServiceBase
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
                EPipeKind::APP_PROJECT_UPDATE       => $this->execAppProjectUpdate($pipe),
                EPipeKind::APP_PROJECT_DELETE       => $this->execAppProjectDelete($pipe),
                default                             => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * にすみ - プロジェクトの削除用
     */
    private function execAppProjectDelete(
        PipeAppProjectDelete|PipeBase $pipe
    ): void {
        // 対象データを取得.
        /** @var TrnProject $target */
        $target                  = TrnProject::query()
            ->where('id', $pipe->trnProjectId)
            ->alive()
            ->firstOrFail();

        // 対象データを削除.
        $target->e_archive_level = EArchiveLevel::ARCHIVE->value;

        // 削除を保存.
        $target->updateOrFail();
    }

    /**
     * @throws Throwable
     */
    private function execAppProjectUpdate(
        PipeAppProjectUpdate|PipeBase $pipe
    ): void {
        // 課基本情報の更新.
        $trnProject          = $this->findByIdOrFail($pipe->trnProjectId);
        $trnProject->name    = $pipe->name;
        $trnProject->explain = $pipe->explain;

        // 保存.
        $this->updateOrFail($trnProject);
    }

    /**
     * オフセットページネーション情報の取得.
     */
    public function offsetPagination(
        int $index,
        int $step,
        array $with = []
    ): array {
        // リスト取得.
        $trnProjectList      = TrnProject::query() //モデル「TrnProject」にてクエリ(呼び出し)を発行
            ->with($with) //withメソッド：モデルで定義したリレーションメソッド名を文字列で指定
            ->alive() //生きてるやつのみ（詳細不明、？）
            ->offset($index * $step) //結果レコードの取得開始位置（何件目から取得するか）を指定
            ->limit($step) //取得レコード数を制限
            ->get(); //実行

        // カウント取得.
        $trnProjectListCount = TrnProject::count();

        return [
            'list'  => $trnProjectList->map(function (TrnProject $trnProject) use ($with) {
                return $trnProject->toPayload($with);
            })->toArray(),
            'count' => $trnProjectListCount,
        ];
    }

    /**
     * Idによる検索(orFail)
     */
    public function findByIdOrFail(
        int $id,
        array $with = []
    ): TrnProject {
        return TrnProject::query()
            ->with($with)
            ->alive()
            ->findOrFail($id);
    }
}
