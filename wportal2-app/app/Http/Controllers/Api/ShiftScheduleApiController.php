<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Shift\UseCase\ExportMonthlyShiftCommand;
use App\Services\Shift\UseCase\ExportMonthlyShiftUseCase;
use Carbon\CarbonImmutable;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * シフトスケジュール API コントローラー
 *
 * GAS（Google Apps Script）などの外部クライアントから
 * Sanctum パーソナルアクセストークンで呼び出すことを想定している。
 */
class ShiftScheduleApiController extends Controller
{
    public function __construct(
        private readonly ExportMonthlyShiftUseCase $exportUseCase,
    ) {}

    /**
     * 全ユーザーの月次シフトを JSON 形式で返す。
     *
     * - 認証: Bearer トークン（Sanctum パーソナルアクセストークン）
     * - クエリパラメータ:
     *     month (string, optional): 対象月。'YYYY-MM' 形式。省略時は当月。
     *
     * @example GET /api/shift_schedule/export?month=2026-05
     */
    public function export(Request $request): JsonResponse
    {
        $targetMonth = $this->resolveMonth($request->query('month'));
        $command     = new ExportMonthlyShiftCommand($targetMonth);
        $rows        = iterator_to_array($this->exportUseCase->execute($command), false);

        $header      = $rows[0] ?? [];
        $dateColumns = array_slice($header, 2);

        $records     = array_map(function (array $row) use ($dateColumns): array {
            $shiftValues = array_slice($row, 2);

            $shifts      = [];
            foreach ($dateColumns as $index => $date) {
                $shifts[$date] = [
                    'shift' => $shiftValues[$index] ?? '',
                ];
            }

            return [
                'name'   => $row[0] ?? '',
                'email'  => $row[1] ?? '',
                'shifts' => $shifts,
            ];
        }, array_slice($rows, 1));

        return response()->json([
            'month'       => $targetMonth->format('Y-m'),
            'generatedAt' => CarbonImmutable::now()->toIso8601String(),
            'dates'       => $dateColumns,
            'users'       => $records,
            'meta'        => [
                'userCount' => count($records),
                'dateCount' => count($dateColumns),
            ],
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    private function resolveMonth(mixed $month): CarbonImmutable
    {
        if ($month === null || $month === '') {
            return CarbonImmutable::now()->startOfMonth();
        }

        try {
            $parsed = CarbonImmutable::createFromFormat('Y-m', $month);
        } catch (InvalidFormatException) {
            return CarbonImmutable::now()->startOfMonth();
        }

        if ($parsed === null) {
            return CarbonImmutable::now()->startOfMonth();
        }

        return $parsed->startOfMonth();
    }
}
