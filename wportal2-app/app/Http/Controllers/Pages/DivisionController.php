<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnDivision;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class DivisionController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('Division/Index', [

            // 課情報.
            'paginationDivision' => fn () => $this->getPaginationDivision($request),
        ]);
    }

    /**
     * ページネーション・課
     */
    private function getPaginationDivision(Request $request): array
    {
        // パラメータ受け取り.
        $pageIndex            = $request->input('index', 0);
        $pageStep             = $request->input('step', 5);

        // TODO: 仮.
        $trnDivisionList      = TrnDivision::query()
            ->offset($pageIndex * $pageStep)
            ->limit($pageStep)
            ->get();

        // TODO: 仮.
        $trnDivisionListCount = TrnDivision::count();

        return [
            'list'  => $trnDivisionList->map(function (TrnDivision $trnDivision) {
                return $trnDivision->toPayload();
            })->toArray(),
            'count' => $trnDivisionListCount,
        ];
    }
}
