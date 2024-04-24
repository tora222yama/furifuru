<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnFacility;
use Illuminate\Http\Request;
use Inertia\Response;

class PaginationController extends Controller
{
    public function invoke(Request $request): Response
    {
        // パラメータ受け取り.
        $pageIndex            = $request->input('index', 0);
        $pageStep             = $request->input('step', 3);

        // TODO: サービス化.
        $trnFacilityList      = TrnFacility::query()
            ->offset($pageIndex * $pageStep)
            ->limit($pageStep)
            ->get();

        // TODO: サービス化.
        $trnFacilityListCount = TrnFacility::count();

        return $this->render('IndexProvider/PaginationIndex', [
            'trnFacilityList'      => $trnFacilityList->map(function (TrnFacility $trnFacility) {
                return $trnFacility->toPayload();
            })->toArray(),
            'trnFacilityListCount' => $trnFacilityListCount,
            'fixList'              => fn () => TrnFacility::query()
                ->limit(5)
                ->get(),
        ]);
    }
}
