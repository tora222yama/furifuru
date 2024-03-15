<?php

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
Route::get('/Test', function () {
    return Inertia::render('Test');
});
Route::get('/First', function () {
    return Inertia::render('FirstPageIndex', [
        'numberValue' => 919,
        'stringValue' => "Quick",
        'arrayValue' => [
            11,
            22,
            "33",
            44,
        ]
    ]);
});
Route::get('/Second', function () {
    return Inertia::render('Second');
});
