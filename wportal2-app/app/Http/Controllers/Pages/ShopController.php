<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Mst\MstGoodsService;
use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use App\Models\App\Mst\MstGoods;
use App\Pipe\App\PipeAppShopLunchTicket;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
     * ランチチケット予約実行.
     */
    public function lunch_ticket(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppShopLunchTicket($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return redirect()->action(EPages::SHOP->getInvokePath());
        }

        // 更新処理.
        DB::transaction(function (): void {
            // チケット代金の消化.
            TrnUserService::updateByPipe();

            // TODO: 売れ行き情報の記録.

            // TODO: rakumoのブロック実行.
        });

        return redirect()->action(EPages::SHOP->getInvokePath());
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
