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
    return view('welcome');
});
Route::get('/first_page', function () {
    return Inertia::render('FirstPageIndex', [
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
Route::get('/second', function () {
    return Inertia::render('Second');
});
Route::get('/health_check', function () {
    return Inertia::render('HealthCheckIndex');
});
