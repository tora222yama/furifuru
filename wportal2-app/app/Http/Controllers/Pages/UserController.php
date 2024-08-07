<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Enum\App\EStatusCode;
use App\Enum\App\EUserAuthority;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Auth\AuthUserService;
use App\Facades\Models\App\Trn\TrnUserAuthorityService;
use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use App\Pipe\App\PipeAppUserCreate;
use App\Pipe\App\PipeAppUserUpdate;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Throwable;

class UserController extends Controller
{
    /**
     * @throws Exception
     */
    public function invoke(Request $request): Response
    {
        return $this->render('User/Index', [

            // ユーザー情報.
            'paginationUser' => fn () => $this->getPaginationUser($request, []),
        ]);
    }

    public function show(Request $request): Response
    {
        return $this->render('User/Show/Index', [

            // ユーザー情報.
            'trnUser' => fn () => $this->getUser($request, [
                'AuthUser',
            ]),
        ]);
    }

    public function edit(Request $request): Response
    {
        // 管理特権が必用.
        $authUser = Auth::user();
        if (! TrnUserAuthorityService::hasAuthority(
            $authUser->TrnUser->id,
            collect([EUserAuthority::ADMIN_PRIVILEGE])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        return $this->render('User/Edit/Index', [
            // ユーザー情報.
            'trnUser' => fn () => $this->getUser($request, [
                'AuthUser',
            ]),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(Request $request): RedirectResponse
    {
        // 管理特権が必用.
        $authUser = Auth::user();
        if (! TrnUserAuthorityService::hasAuthority(
            $authUser->TrnUser->id,
            collect([EUserAuthority::ADMIN_PRIVILEGE])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        // パイプ作成.
        /** @var PipeAppUserUpdate $pipe */
        $pipe     = PipeService::insertNewPipe(
            new PipeAppUserUpdate($request->toArray())
        );

        // TODO: バリデーションチェック.

        // 更新処理.
        DB::transaction(function (): void {
            // 認証情報の更新.
            AuthUserService::updateByPipe();
        });

        return redirect()->action(EPages::USER__SHOW->getInvokePath(), [
            'userId' => $pipe->trnUserId,
        ]);
    }

    public function new(Request $request): Response
    {
        // 管理特権が必用.
        $authUser = Auth::user();
        if (! TrnUserAuthorityService::hasAuthority(
            $authUser->TrnUser->id,
            collect([EUserAuthority::ADMIN_PRIVILEGE])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        return $this->render('User/Create/Index', [
            // セッションにバリデーション情報があれば取得する.
            'serverValidation'    => fn () => session('serverValidation') ?? null,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function create(Request $request): RedirectResponse
    {
        // 管理特権が必用.
        $authUser = Auth::user();
        if (! TrnUserAuthorityService::hasAuthority(
            $authUser->TrnUser->id,
            collect([EUserAuthority::ADMIN_PRIVILEGE])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppUserCreate($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            return redirect()->action(EPages::USER__NEW->getInvokePath())
                ->with([
                    'serverValidation' => PipeService::getValidationResult(),
                ]);
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // 認証情報の更新.
            AuthUserService::updateByPipe();

            // ユーザー情報の更新.
            TrnUserService::updateByPipe();
        });

        return redirect()->action(EPages::USER->getInvokePath());
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
