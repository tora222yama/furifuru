<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages\Sample;

use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnUser;
use Inertia\Response;

class MvcValueController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('Sample/MvcValue/Index', [
            'numberValue'     => 919,
            'stringValue'     => 'This message was provided from PHP Controller.',
            'arrayValue'      => [
                11,
                22,
                '33',
                44,
            ],

            // DBから値をReactへ. 値がnullなどが混在する可能性があり、専用のarray関数が望ましい.
            'trnUserList'     => fn () => $this->getUserList(),
        ]);
    }

    /**
     * 施設データリスト取得.
     */
    private function getUserList(array $with = []): array
    {
        // DBからのデータ取得サンプル.
        $userList = TrnUser::query()
            ->with($with)
            ->limit(10)
            ->get();

        return $userList->map(function (TrnUser $trnUser) use ($with) {
            return $trnUser->toPayload($with);
        })->toArray();
    }
}
