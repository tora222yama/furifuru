<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('IndexProvider/DashboardIndex');
});
Route::get('/dashboard', function () {
    \Illuminate\Support\Facades\Log::info('dashboardへの接続');

    return Inertia::render('IndexProvider/DashboardIndex');
});
Route::get('/first_page', function () {
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
});
Route::get('/health_check', function () {
    return Inertia::render('IndexProvider/HealthCheckIndex');
});
