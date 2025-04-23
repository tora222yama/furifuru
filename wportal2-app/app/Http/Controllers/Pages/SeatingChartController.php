<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EStatusCode;
use App\Enum\App\EUserAuthority;
use App\Facades\Models\App\Trn\TrnSeatService;
use App\Facades\Models\App\Trn\TrnUserAuthorityService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnSeat;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class SeatingChartController extends Controller
{
    public function invoke(): Response
    {
        // 管理特権が必用.
        $authUser         = Auth::user();

        if (! TrnUserAuthorityService::hasAuthority(
            $authUser?->TrnUser?->id ?: 0,
            collect([EUserAuthority::ADMIN_PRIVILEGE, EUserAuthority::ADMIN_COMMAND])
        )) {
            abort(EStatusCode::NOT_FOUND->value);
        }

        $seats = TrnSeatService::list();
        
        return $this->render('SeatingChart/Index', [
            'trnSeatList' => $seats->map(function (TrnSeat $seat) {
                return $seat->toPayload();
            }),
        ]);
    }
}
