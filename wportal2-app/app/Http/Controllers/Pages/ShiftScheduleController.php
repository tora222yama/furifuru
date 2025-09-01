<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Inertia\Response;

class ShiftScheduleController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('ShiftSchedule/Index', [
            // シフト管理画面
            'testProps' => 'testValue',
        ]);
    }
}
