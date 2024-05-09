<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnDivisionService;
use App\Http\Controllers\Controller;
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
     * @throws Exception
     */
    public function show(): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('Division/Show/Index');
    }

    /**
     * ページネーション・課
     */
    private function getPaginationDivision(Request $request): array
    {
        // パラメータ受け取り.
        $pageIndex            = $request->input('index', 0);
        $pageStep             = $request->input('step', 5);

        return TrnDivisionService::offsetPagination(
            $pageIndex,
            $pageStep,
            [
                'TrnDivisionUser',
                'TrnDivisionUser' => [
                    'TrnUser',
                ],
            ]
        );
    }
}
