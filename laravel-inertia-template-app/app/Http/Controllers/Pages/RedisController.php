<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RedisController extends Controller
{
    public function invoke(): Response
    {
        return Inertia::render('IndexProvider/RedisIndex');
    }
}
