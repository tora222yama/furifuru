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

Route::get('/', EPages::DASHBOARD->getInvokePath());
Route::get('/dashboard', EPages::DASHBOARD->getInvokePath());
Route::get('/mvc_value', EPages::MVC_VALUE->getInvokePath());
Route::get('/input_form', EPages::INPUT_FORM->getInvokePath());
Route::get('/redis', EPages::REDIS->getInvokePath());
Route::get('/slack_log', EPages::SLACK_LOG->getInvokePath());
Route::get('/health_check', EPages::HEALTH_CHECK->getInvokePath());
