<?php

declare(strict_types=1);

use App\Enum\App\EPages;
use Illuminate\Support\Facades\Route;

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

Route::group(['middleware' => ['auth:web']], function () {
    Route::get('/', EPages::DASHBOARD->getInvokePath());
    Route::get('/dashboard', EPages::DASHBOARD->getInvokePath());
});

Route::get('/login', EPages::LOGIN->getInvokePath())
    ->name('login');
Route::get('/auth/google', '\App\Http\Controllers\Pages\LoginController@getGoogleAuth');
Route::get('/login/googleCallback', '\App\Http\Controllers\Pages\LoginController@authGoogleCallback');
Route::get('/logout', '\App\Http\Controllers\Pages\LoginController@logout');

// 認証前はログイン、認証後は404にフォールバックする
Route::fallback(EPages::LOGIN->getInvokePath());
Route::group(['middleware' => ['auth:web']], function () {
    Route::fallback(EPages::NOT_FOUND->getInvokePath());
});
