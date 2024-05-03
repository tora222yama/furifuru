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

        $trnUser = TrnUserService::findByAuthId(Auth::id());

        return $this->render('PersonalSetting/Show/Index', [
            'trnUserSlackProfile' => $trnUser->TrnUserSlackProfile?->toPayload(),
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

        $trnUser = TrnUserService::findByAuthId(Auth::id());

        return $this->render('PersonalSetting/Edit/Index', [
            'trnUserSlackProfile' => $trnUser->TrnUserSlackProfile?->toPayload(),
        ]);
    }
}
