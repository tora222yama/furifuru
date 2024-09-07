<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnUserRewardService;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Inertia\Response;

class RewardController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        return $this->render('Reward/Index', [

            // 報酬情報.
            'paginationReward' => fn () => $this->getPaginationReward($request, []),
        ]);
    }

    /**
     * ページネーション・報酬.
     */
    private function getPaginationReward(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex        = $request->input('index', 0);
        $pageStep         = $request->input('step', 20);

        return TrnUserRewardService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }
}
