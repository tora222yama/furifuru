<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\GraphQL\App\Mutations\Pipe\PipeAppProjectUpdate;
use App\GraphQL\PipeBase;
use App\Models\App\Trn\TrnProject;
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
                default                             => throw new Exception(),
            };
            $pipe->onUpdate(__CLASS__);
        }
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
        $trnProjectList      = TrnProject::query()
            ->with($with)
            ->alive()
            ->offset($index * $step)
            ->limit($step)
            ->get();

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
