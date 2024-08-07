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
    Route::match(['get', 'post'], '/attendance', EPages::ATTENDANCE->getInvokePath());
    Route::post('/attendance/create', EPages::ATTENDANCE_CREATE->getInvokePath());
    Route::post('/attendance/delete', EPages::ATTENDANCE_DELETE->getInvokePath());
    Route::post('/attendance/project_priority', EPages::ATTENDANCE_PROJECT_PRIORITY->getInvokePath());
    Route::post('/attendance/division_priority', EPages::ATTENDANCE_DIVISION_PRIORITY->getInvokePath());
    Route::match(['get', 'post'], '/division', EPages::DIVISION->getInvokePath());
    Route::get('/division/{divisionId}/show', EPages::DIVISION__SHOW->getInvokePath())
        ->where('divisionId', '[0-9]+');
    Route::get('/division/{divisionId}/edit', EPages::DIVISION__EDIT->getInvokePath())
        ->where('divisionId', '[0-9]+');
    Route::post('/division/update', EPages::DIVISION__UPDATE->getInvokePath());
    Route::post('/division/update_user', EPages::DIVISION__UPDATE_USER->getInvokePath());
    Route::post('/division/delete', EPages::DIVISION__DELETE->getInvokePath());
    Route::match(['get', 'post'], '/project', EPages::PROJECT->getInvokePath());
    Route::get('/project/{projectId}/show', EPages::PROJECT__SHOW->getInvokePath())
        ->where('projectId', '[0-9]+');
    Route::get('/project/{projectId}/edit', EPages::PROJECT__EDIT->getInvokePath())
        ->where('projectId', '[0-9]+');
    Route::post('/project/update', EPages::PROJECT__UPDATE->getInvokePath());
    Route::post('/project/update_user', EPages::PROJECT__UPDATE_USER->getInvokePath());
    Route::get('/project/new', EPages::PROJECT__NEW->getInvokePath());
    Route::post('/project/create', EPages::PROJECT__CREATE->getInvokePath());
    Route::post('/project/delete', EPages::PROJECT__DELETE->getInvokePath());
    ROUTE::match(['get', 'post'], '/user', EPages::USER->getInvokePath());
    Route::get('/user/{userId}/show', EPages::USER__SHOW->getInvokePath())
        ->where('userId', '[0-9]+');
    Route::get('/user/{userId}/edit', EPages::USER__EDIT->getInvokePath())
        ->where('userId', '[0-9]+');
    Route::post('/user/update', EPages::USER__UPDATE->getInvokePath());
    Route::get('/user/new', EPages::USER__NEW->getInvokePath());
    Route::post('/user/create', EPages::USER__CREATE->getInvokePath());
    Route::get('/personal_setting/show', EPages::PERSONAL_SETTING__SHOW->getInvokePath());
    Route::get('/personal_setting/edit', EPages::PERSONAL_SETTING__EDIT->getInvokePath());
    Route::post('/personal_setting/update', EPages::PERSONAL_SETTING__UPDATE->getInvokePath());

    Route::get('/sample/dashboard', EPages::SAMPLE_DASHBOARD->getInvokePath());
    Route::get('/sample/mvc_value', EPages::SAMPLE_MVC_VALUE->getInvokePath());
    Route::get('/sample/input_form', EPages::SAMPLE_INPUT_FORM->getInvokePath());
    Route::post('/sample/input_form/create', EPages::SAMPLE_INPUT_FORM__CREATE->getInvokePath());
    Route::get('/sample/redis', EPages::SAMPLE_REDIS->getInvokePath());
    Route::post('/sample/redis_post_result', EPages::SAMPLE_REDIS_POST_RESULT->getInvokePath());
    Route::get('/sample/slack_log', EPages::SAMPLE_SLACK_LOG->getInvokePath());
    Route::match(['get', 'post'], '/sample/pagination', EPages::SAMPLE_PAGINATION->getInvokePath());
    Route::get('/sample/intern', EPages::SAMPLE_INTERN->getInvokePath());
});

Route::get('/image/{path?}', '\App\Http\Controllers\ImageController@invoke')
    ->where('path', '.*');

Route::get('/login', EPages::LOGIN->getInvokePath())
    ->name('login');
Route::post('/legacy_login', EPages::LEGACY_LOGIN->getInvokePath());
Route::post('/onetime_password_login', EPages::ONETIME_PASSWORD_LOGIN->getInvokePath());
Route::get('/auth/google', '\App\Http\Controllers\Pages\LoginController@getGoogleAuth');
Route::get('/login/googleCallback', '\App\Http\Controllers\Pages\LoginController@authGoogleCallback');
Route::get('/logout', '\App\Http\Controllers\Pages\LoginController@logout');

// 認証前はログイン、認証後は404にフォールバックする
Route::fallback(EPages::LOGIN->getInvokePath());
Route::group(['middleware' => ['auth:web']], function () {
    Route::fallback(EPages::NOT_FOUND->getInvokePath());
});
