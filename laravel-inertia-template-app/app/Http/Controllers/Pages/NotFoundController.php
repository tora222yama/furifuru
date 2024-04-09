<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class NotFoundController extends Controller
{
    public function invoke(): Response
    {
        return Inertia::render('IndexProvider/NotFoundIndex');
    }
}
