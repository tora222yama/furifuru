<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;

class AdminController extends Controller
{
    public function show(Request $request): Response
    {
        return $this->render('Admin/Command/Index', []);
    }
}
