<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EStatusCode;
use App\Enum\App\EUserAuthority;
use App\Http\Controllers\Controller;
use App\Services\Models\App\Trn\TrnUserAuthorityService;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class SeatingChartController extends Controller
{
    public function invoke(): Response
    {
        $authUser         = Auth::user();
        $authorityService = new TrnUserAuthorityService;
        if (! $authorityService->hasAuthority(
            $authUser?->TrnUser?->id ?: 0,
            collect([EUserAuthority::ADMIN_PRIVILEGE, EUserAuthority::ADMIN_COMMAND])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        return $this->render('SeatingChart/Index');
    }
}
