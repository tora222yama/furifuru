<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnProjectService;
use App\Facades\Models\App\Trn\TrnProjectUserService;
use App\Http\Controllers\Controller;
use App\Pipe\App\PipeAppProjectDelete;
use App\Pipe\App\PipeAppProjectUpdate;
use App\Pipe\App\PipeAppProjectUserUpdate;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Throwable;

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
                'TrnProjectUser.TrnUser',
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
            'trnProject'          => fn () => $this->getProject($request, [
                'TrnProjectUser',
                'TrnProjectUser' => [
                    'TrnUser',
                ],
            ]),

            // セッションにバリデーション情報があれば取得する.
            'serverValidation'    => fn () => session('serverValidation') ?? null,
        ]);
    }

    /**
     * プロジェクトの更新.
     *
     * @throws Throwable
     */
    public function update(Request $request): RedirectResponse
    {
        // パイプ作成.
        /** @var PipeAppProjectUpdate $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeAppProjectUpdate($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return redirect()->action(EPages::PROJECT__EDIT->getInvokePath(), [
                'projectId' => $pipe->trnProjectId,
            ])->with([
                'serverValidation' => PipeService::getValidationResult(),
            ]);
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // プロジェクト情報の更新.
            TrnProjectService::updateByPipe();
        });

        return redirect()->action(EPages::PROJECT__SHOW->getInvokePath(), [
            'projectId' => $pipe->trnProjectId,
        ]);
    }

    /**
     * プロジェクトの更新.
     *
     * @throws Throwable
     */
    public function update_user(Request $request): RedirectResponse
    {
        // パイプ作成.
        /** @var PipeAppProjectUserUpdate $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeAppProjectUserUpdate($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return redirect()->action(EPages::PROJECT__SHOW->getInvokePath(), [
                'projectId' => $pipe->trnProjectId,
            ]);
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 所属メンバーの更新.
            TrnProjectUserService::updateByPipe();
        });

        return redirect()->action(EPages::PROJECT__SHOW->getInvokePath(), [
            'projectId' => $pipe->trnProjectId,
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

    /**
     * プロジェクト削除処理
     */
    public function delete(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppProjectDelete($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // プロジェクトの削除.
            TrnProjectService::updateByPipe();
        });

        return redirect()->action(EPages::PROJECT->getInvokePath());
    }
}
