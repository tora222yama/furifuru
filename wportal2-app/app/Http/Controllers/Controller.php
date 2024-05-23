<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\App\Auth\AuthUser;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Inertia\Response;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Inertiaを介してhtmlを作成
     *
     * @note ログイン情報など、共通のパラメータを処理.
     */
    protected function render(
        string $component,
        array|Arrayable $props = []
    ): Response {
        // ローカルで処理が早すぎないように調整する.
        localSleep();

        // TODO: 遅延評価が必要.
        return Inertia::render($component, array_merge(
            $props,
            [
                'csrfToken'      => csrf_token(),
                'authUser'       => fn () => $this->getAuthUser([
                    'TrnUser',
                ]),
                'location'       => [
                    'current' => Request::url(),
                    'path'    => Request::path(),
                ],
            ],
        ));
    }

    private function getAuthUser(array $with = []): ?array
    {
        $authUser = AuthUser::query()
            ->with($with)
            ->findOrFail(Auth::id());

        return $authUser?->toPayload($with);
    }
}
