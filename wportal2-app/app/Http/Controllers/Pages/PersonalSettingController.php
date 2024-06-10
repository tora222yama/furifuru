<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Facades\Models\App\Trn\TrnUserService;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class PersonalSettingController extends Controller
{
    /**
     * 個人設定・閲覧.
     *
     * @throws Exception
     */
    public function show(): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('PersonalSetting/Show/Index', [
            'trnUserSlackProfile' => fn () => $this->getTrnUserSlackProfile(),
        ]);
    }

    /**
     * 個人設定・編集.
     *
     * @throws Exception
     */
    public function edit(): Response
    {
        if (! Auth::check()) {
            throw new Exception();
        }

        return $this->render('PersonalSetting/Edit/Index', [
            'trnUserSlackProfile' => fn () => $this->getTrnUserSlackProfile(),
        ]);
    }

    /**
     * TrnUserSlackProfileの取得.
     */
    private function getTrnUserSlackProfile(): array
    {
        $authId  = Auth::id();

        // ユーザー情報を取得.
        $trnUser = TrnUserService::findByAuthId($authId);
        if ($trnUser === null) {
            return [];
        }

        return $trnUser->TrnUserSlackProfile?->toPayload() ?? [];
    }
}
