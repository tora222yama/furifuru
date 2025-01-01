<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\ShuffleLunch\ECalculate;
use App\Enum\App\ShuffleLunch\ERegister;
use App\Enum\App\ShuffleLunch\ETimeZone;
use App\Http\Controllers\Controller;
use Inertia\Response;

class ShuffleLunchController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('ShuffleLunch/Index', [

            // マッチング情報.
            'timezone'   => fn () => ETimeZone::STANDBY,
            'calculate'  => fn () => ECalculate::INVALID,
            'registered' => fn () => ERegister::INVALID,
        ]);
    }
}
