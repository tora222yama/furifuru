<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnFacility;
use Inertia\Inertia;
use Inertia\Response;

class MvcValueController extends Controller
{
    public function invoke(): Response
    {
        // DBからのデータ取得サンプル.
        $facilityList = TrnFacility::query()
            ->where('category_id', '<=', 1500)
            ->get();

        return Inertia::render('IndexProvider/MvcValueIndex', [
            'numberValue'     => 919,
            'stringValue'     => 'This message was provided from PHP Controller.',
            'arrayValue'      => [
                11,
                22,
                '33',
                44,
            ],

            // DBから値をReactへ. 値がnullなどが混在する可能性があり、専用のarray関数が望ましい.
            'trnFacilityList' => $facilityList->map(function (TrnFacility $trnFacility) {
                return $trnFacility->toPayload();
            }),
        ]);
    }
}
