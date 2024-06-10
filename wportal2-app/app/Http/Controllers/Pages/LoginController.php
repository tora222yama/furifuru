<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Throwable;

class LoginController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('Login/Index');
    }

    public function getGoogleAuth(): RedirectResponse
    {
        return Socialite::driver('google')
            ->redirect();
    }

    /**
     * @throws Throwable
     */
    public function authGoogleCallback(): object
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // ユーザー情報を検索.
        $authUser   = AuthUser::query()
            ->where('email', $googleUser->email)
            ->first();

        // ユーザーがなく、919ドメインでなければ止めたいログイン.
        if ($authUser === null && ! $this->is919Domain($googleUser)) {
            Log::error('invalid domain:'.$googleUser->email);

            return redirect('/login');
        }

        // 新規ユーザーの作成.
        if ($authUser === null) {
            $authUser = $this->createNewUserByGoogle($googleUser);
        }

        Auth::login($authUser, true);

        return redirect('/dashboard');
    }

    /**
     * 919ドメインかどうか.
     */
    private function is919Domain($googleUser): bool
    {
        // 919ドメインチェックが無効の場合は919ドメインとして扱う.
        $check919Domain = config('auth.check919Domain');
        if (! $check919Domain) {
            return true;
        }

        // 認証アドレスが919.jpのみ.
        $hd             = $googleUser->user['hd'] ?? '';
        if ($hd === '919.jp') {
            return true;
        }

        return false;
    }

    /**
     * ログアウト処理.
     */
    public function logout(): object
    {
        Auth::logout();

        return redirect('/login');
    }

    /**
     * 新規ユーザーの作成.
     *
     * @throws Throwable
     */
    private function createNewUserByGoogle($googleUser): AuthUser
    {
        return DB::transaction(static function () use ($googleUser) {
            $name                        = $googleUser->user['family_name'].' '.$googleUser->user['given_name'];

            // 認証ユーザーを作成.
            $authUser                    = new AuthUser();
            $authUser->email             = $googleUser->getEmail();
            $authUser->name              = $name;
            $authUser->email_verified_at = now();
            $authUser->password          = substr(bin2hex(random_bytes(16)), 0, 16);
            $authUser->google_id         = $googleUser->getId();
            $authUser->saveOrFail();

            // ユーザーを作成.
            TrnUserService::createNewUser($authUser, $name);

            return $authUser;
        });
    }
}
