<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Mst\MstGoodsService;
use App\Http\Controllers\Controller;
use App\Models\App\Mst\MstGoods;
use Exception;
use Illuminate\Http\Request;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        return $this->render('Shop/Index', [

            // 商品情報.
            'mstGoodsList' => fn () => $this->getMstGoodsList($request, []),
        ]);
    }

    /**
     * 商品マスタ取得.
     */
    private function getMstGoodsList($request, array $with = []): array
    {
        return MstGoodsService::list($with)
            ->map(fn (MstGoods $mstGoods) => $mstGoods->toPayload($with))
            ->toArray();
    }
}
