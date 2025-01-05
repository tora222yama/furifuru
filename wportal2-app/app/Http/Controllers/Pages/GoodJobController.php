<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnGoodJobService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;

class GoodJobController extends Controller
{
    /**
     * 感謝を伝える基本ページ表示処理.
     */
    public function invoke(Request $request): Response
    {
        return $this->render('GoodJob/Index', [

            // GoodJob情報.
            'paginationGoodJob' => fn () => $this->getPaginationGoodJob($request, [

            ]),

        ]);
    }

    /**
     * ページネーション・GoodJob.
     *
     * @param  array<mixed>  $with
     * @return array<string, mixed>
     */
    private function getPaginationGoodJob(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex = (int) $request->input('index', 0);
        $pageStep  = (int) $request->input('step', 20);

        return TrnGoodJobService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }
}
