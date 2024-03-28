<?php

declare(strict_types=1);

use App\Enum\EPages;
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

Route::get('/', EPages::DASHBOARD->getInvokePath());
Route::get('/dashboard', EPages::DASHBOARD->getInvokePath());
Route::get('/redis', EPages::REDIS->getInvokePath());
Route::get('/slack_log', EPages::SLACK_LOG->getInvokePath());
Route::get('/first_page', EPages::FIRST_PAGE->getInvokePath());
Route::get('/health_check', EPages::HEALTH_CHECK->getInvokePath());
