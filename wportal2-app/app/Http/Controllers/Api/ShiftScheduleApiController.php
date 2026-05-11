<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Shift\UseCase\ExportMonthlyShiftCommand;
use App\Services\Shift\UseCase\ExportMonthlyShiftUseCase;
use Carbon\CarbonImmutable;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
     * 全ユーザーの月次シフトを CSV 形式で返す。
     *
     * - 認証: Bearer トークン（Sanctum パーソナルアクセストークン）
     * - クエリパラメータ:
     *     month (string, optional): 対象月。'YYYY-MM' 形式。省略時は当月。
     *
     * @example GET /api/shift_schedule/export?month=2026-05
     */
    public function export(Request $request): StreamedResponse
    {
        $targetMonth = $this->resolveMonth($request->query('month'));
        $command     = new ExportMonthlyShiftCommand($targetMonth);
        $fileName    = "shift_{$targetMonth->format('Y-m')}.csv";

        return new StreamedResponse(
            function () use ($command): void {
                $handle = fopen('php://output', 'w');
                assert($handle !== false);

                // BOM for Excel UTF-8 recognition
                fwrite($handle, "\xEF\xBB\xBF");

                foreach ($this->exportUseCase->execute($command) as $row) {
                    fputcsv($handle, $row);
                }

                fclose($handle);
            },
            200,
            [
                'Content-Type'        => 'text/csv; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            ],
        );
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
