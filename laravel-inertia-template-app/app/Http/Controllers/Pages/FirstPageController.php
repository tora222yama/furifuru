<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FirstPageController extends Controller
{
    public function invoke(): Response
    {
        return Inertia::render('IndexProvider/FirstPageIndex', [
            'numberValue' => 919,
            'stringValue' => 'Quick',
            'arrayValue' => [
                11,
                22,
                '33',
                44,
            ],
        ]);
    }
}
