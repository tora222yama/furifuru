<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ShiftScheduleApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * シフト管理 API
 *
 * 認証: Sanctum パーソナルアクセストークン（Authorization: Bearer <token>）
 * 認可: shift_schedule:read
 * 用途: GAS など外部クライアントからのシフト取得
 * 詳細: document/features/SHIFT_SCHEDULE_API.md を参照
 */
Route::middleware(['auth:sanctum', 'ability:shift_schedule:read'])->prefix('shift_schedule')->group(function () {
    // 全ユーザーの月次シフト JSON 取得
    // GET /api/shift_schedule/export?month=YYYY-MM
    Route::get('/export', [ShiftScheduleApiController::class, 'export']);
});

// ヘルスチェック用
Route::get('/healthcheck', static function () {
    return response()->json();
});

// デプロイ確認用
Route::get('/deployed', static function () {
    return response()->json(['status' => 'deployed']);
});
