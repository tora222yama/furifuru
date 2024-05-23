<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('User/Index', [

            // ユーザー情報.
            'paginationUser' => fn () => $this->getPaginationUser($request),
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

        return $this->render('User/Show/Index', [

            // ユーザー情報.
            'trnUser' => fn () => $this->getUser($request, [

            ]),
        ]);
    }

    /**
     * ページネーション・ユーザー
     */
    private function getPaginationUser(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex = $request->input('index', 0);
        $pageStep  = $request->input('step', 20);

        return TrnUserService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }

    /**
     * 単独取得・ユーザー.
     */
    private function getUser(Request $request, array $with = []): array
    {
        return TrnUserService::findByIdOrFail(
            $request->route('userId'),
            $with
        )->toPayload($with);
    }
}
