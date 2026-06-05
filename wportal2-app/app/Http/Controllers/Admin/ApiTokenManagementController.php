<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enum\App\EStatusCode;
use App\Enum\App\EUserAuthority;
use App\Facades\Models\App\Trn\TrnUserAuthorityService;
use App\Http\Controllers\Controller;
use App\Models\App\Auth\AuthUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * GAS 連携用 API トークン管理画面
 *
 * ログイン中の admin ユーザー自身にトークンを発行する。
 */
class ApiTokenManagementController extends Controller
{
    private const string SHIFT_SCHEDULE_TOKEN_NAME     = 'GAS連携';

    /** @var list<string> */
    private const array SHIFT_SCHEDULE_TOKEN_ABILITIES = ['shift_schedule:read'];

    /**
     * API トークン一覧表示
     */
    public function index(): InertiaResponse
    {
        $authUser = $this->authorizeAndGetUser();

        $tokens   = $authUser->tokens()
            ->select('id', 'name', 'created_at', 'last_used_at', 'expires_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($token) => [
                'id'           => $token->id,
                'name'         => $token->name,
                'created_at'   => $token->created_at?->format('Y-m-d H:i'),
                'last_used_at' => $token->last_used_at?->format('Y-m-d H:i') ?? '未使用',
                'expires_at'   => $token->expires_at?->format('Y-m-d')       ?? '無期限',
                'is_expired'   => $token->expires_at && $token->expires_at->isPast(),
            ]);

        return Inertia::render('Admin/ApiTokenManagement/Index', [
            'user'   => [
                'id'    => $authUser->id,
                'email' => $authUser->email,
                'name'  => $authUser->name,
            ],
            'tokens' => $tokens,
        ]);
    }

    /**
     * 新規トークン発行
     */
    public function issue(): RedirectResponse
    {
        $authUser = $this->authorizeAndGetUser();

        if ($authUser->tokens()->exists()) {
            return redirect()->route('admin.api-tokens.index')
                ->with('error', 'トークンが既に存在します。新しいトークンが必要な場合はローテーションを使用してください。');
        }

        $token    = $authUser->createToken(
            self::SHIFT_SCHEDULE_TOKEN_NAME,
            self::SHIFT_SCHEDULE_TOKEN_ABILITIES,
        );

        session()->put('api_token_plain', $token->plainTextToken);

        return redirect()->route('admin.api-tokens.show');
    }

    /**
     * トークンを表示（初回のみ）
     */
    public function show(): InertiaResponse|RedirectResponse
    {
        $this->authorizeAndGetUser();

        $plainToken = session()->pull('api_token_plain');

        if (! $plainToken) {
            return redirect()->route('admin.api-tokens.index')
                ->with('error', 'トークンはセッション切れです。');
        }

        return Inertia::render('Admin/ApiTokenShow/Index', [
            'token' => $plainToken,
        ]);
    }

    /**
     * トークン削除
     */
    public function destroy(int $tokenId): RedirectResponse
    {
        $authUser = $this->authorizeAndGetUser();

        $token    = $authUser->tokens()->where('id', $tokenId)->first();

        if (! $token) {
            return redirect()->back()
                ->with('error', 'トークンが見つかりません。');
        }

        $token->delete();

        return redirect()->route('admin.api-tokens.index')
            ->with('success', 'トークンを削除しました。');
    }

    /**
     * トークンローテーション（新規発行 + 古いものを削除）
     */
    public function rotate(): RedirectResponse
    {
        $authUser = $this->authorizeAndGetUser();

        $authUser->tokens()->delete();

        $token    = $authUser->createToken(
            self::SHIFT_SCHEDULE_TOKEN_NAME,
            self::SHIFT_SCHEDULE_TOKEN_ABILITIES,
        );

        session()->put('api_token_plain', $token->plainTextToken);

        return redirect()->route('admin.api-tokens.show');
    }

    /**
     * ADMIN_PRIVILEGE を検証し、認証済みユーザーを返す。
     */
    private function authorizeAndGetUser(): AuthUser
    {
        /** @var AuthUser $authUser */
        $authUser = Auth::user();

        if (! TrnUserAuthorityService::hasAuthority(
            $authUser->TrnUser?->id ?: 0,
            collect([EUserAuthority::ADMIN_PRIVILEGE]),
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        return $authUser;
    }
}
