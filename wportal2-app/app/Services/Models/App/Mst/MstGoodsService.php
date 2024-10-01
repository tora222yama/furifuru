<?php

declare(strict_types=1);

namespace App\Services\Models\App\Mst;

use App\Models\App\Mst\MstGoods;
use App\Services\Models\ModelServiceBase;
use Illuminate\Support\Collection;

class MstGoodsService extends ModelServiceBase
{
    /**
     * 全取得.
     */
    public function list(
        array $with = []
    ): Collection {
        return MstGoods::query()
            ->alive()
            ->get();
    }
}
