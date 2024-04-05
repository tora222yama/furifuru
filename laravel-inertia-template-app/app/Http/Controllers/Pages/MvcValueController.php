<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class MvcValueController extends Controller
{
    public function invoke(): Response
    {
        return Inertia::render('IndexProvider/MvcValueIndex', [
            'numberValue' => 919,
            'stringValue' => 'This message was provided from PHP Controller.',
            'arrayValue'  => [
                11,
                22,
                '33',
                44,
            ],
        ]);
    }
}
