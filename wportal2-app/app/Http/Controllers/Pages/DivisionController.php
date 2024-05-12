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
            'paginationDivision' => fn () => $this->getPaginationDivision($request, [
                'TrnDivisionUser',
                'TrnDivisionUser' => [
                    'TrnUser',
                ],
            ]),
        ]);
    }

    /**
     * @throws Exception
     */
    public function show(Request $request): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('Division/Show/Index', [

            // 課情報.
            'trnDivision' => fn () => $this->getDivision($request, [
                'TrnDivisionUser',
                'TrnDivisionUser' => [
                    'TrnUser',
                ],
            ]),
        ]);
    }

    /**
     * @throws Exception
     */
    public function edit(Request $request): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('Division/Edit/Index', [

            // 課情報.
            'trnDivision' => fn () => $this->getDivision($request, [
                'TrnDivisionUser',
                'TrnDivisionUser' => [
                    'TrnUser',
                ],
            ]),
        ]);
    }

    /**
     * ページネーション・課
     */
    private function getPaginationDivision(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex            = $request->input('index', 0);
        $pageStep             = $request->input('step', 5);

        return TrnDivisionService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }

    /**
     * 単独取得・課.
     */
    private function getDivision(Request $request, array $with = []): array
    {
        return TrnDivisionService::findByIdOrFail(
            $request->route('divisionId'),
            $with,
        )->toPayload($with);
    }
}
