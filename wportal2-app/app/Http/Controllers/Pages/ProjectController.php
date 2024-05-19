<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnProjectService;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('Project/Index', [

            // プロジェクト情報.
            'paginationProject' => fn () => $this->getPaginationProject($request, [
                'TrnProjectUser',
                'TrnProjectUser' => [
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

        return $this->render('Project/Show/Index', [

            // プロジェクト情報.
            'trnProject' => fn () => $this->getProject($request, [
                'TrnProjectUser',
                'TrnProjectUser' => [
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

        return $this->render('Project/Edit/Index', [

            // プロジェクト情報.
            'trnProject' => fn () => $this->getProject($request, [
                'TrnProjectUser',
                'TrnProjectUser' => [
                    'TrnUser',
                ],
            ]),
        ]);
    }

    /**
     * ページネーション・プロジェクト.
     */
    private function getPaginationProject(Request $request, array $with = []): array
    {
        // パラメータ受け取り.
        $pageIndex = $request->input('index', 0);
        $pageStep  = $request->input('step', 5);

        return TrnProjectService::offsetPagination(
            $pageIndex,
            $pageStep,
            $with
        );
    }

    /**
     * 単独取得・プロジェクト.
     */
    private function getProject(Request $request, array $with = []): array
    {
        return TrnProjectService::findByIdOrFail(
            $request->route('projectId'),
            $with,
        )->toPayload($with);
    }
}
