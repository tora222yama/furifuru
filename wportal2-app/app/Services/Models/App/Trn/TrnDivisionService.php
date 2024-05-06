<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Models\App\Trn\TrnDivision;
use App\Services\Models\ModelServiceBase;

class TrnDivisionService extends ModelServiceBase
{
    /**
     * オフセットページネーション情報の取得.
     */
    public function offsetPagination(
        int $index,
        int $step,
        array $with = []
    ): array {
        // リスト取得.
        $trnDivisionList      = TrnDivision::query()
            ->with($with)
            ->offset($index * $step)
            ->limit($step)
            ->get();

        // カウント取得.
        $trnDivisionListCount = TrnDivision::count();

        return [
            'list'  => $trnDivisionList->map(function (TrnDivision $trnDivision) use ($with) {
                return $trnDivision->toPayload($with);
            })->toArray(),
            'count' => $trnDivisionListCount,
        ];
    }
}
