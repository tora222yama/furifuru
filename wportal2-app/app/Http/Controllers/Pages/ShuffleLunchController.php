<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Response;

class ShuffleLunchController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('ShuffleLunch/Index');
    }
}
