<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages\Sample;

use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class PaginationController extends Controller
{
    public function invoke(Request $request): Response
    {
        return $this->render('Sample/Pagination/Index', [
            'paginationTrnUser'  => fn () => $this->getPaginationFacility($request),
            'fixList'            => fn () => $this->getFixList(),
        ]);
    }

    /**
     * ページネーション・施設
     */
    private function getPaginationFacility(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex = $request->input('index', 0);
        $pageStep  = $request->input('step', 3);

        Log::info($pageIndex);

        return TrnUserService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }

    /**
     * 固定リスト・施設.
     */
    private function getFixList(array $with = [])
    {
        return TrnUser::query()
            ->with($with)
            ->limit(5)
            ->get()
            ->map(function (TrnUser $trnUser) use ($with) {
                return $trnUser->toPayload($with);
            })->toArray();
    }
}
