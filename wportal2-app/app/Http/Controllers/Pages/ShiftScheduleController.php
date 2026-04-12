<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShiftStoreRequest;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftSettingsRepositoryInterface;
use App\Services\Shift\UseCase\ExportMonthlyShiftCommand;
use App\Services\Shift\UseCase\ExportMonthlyShiftUseCase;
use App\Services\Shift\UseCase\ShiftRegistrationCommand;
use App\Services\Shift\UseCase\ShiftRegistrationUseCase;
use Carbon\CarbonImmutable;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShiftScheduleController extends Controller
{
    public function __construct(
        private readonly ShiftRegistrationUseCase $shiftRegistrationService,
        private readonly ExportMonthlyShiftUseCase $exportUseCase,
        private readonly ShiftScheduleRepositoryInterface $shiftScheduleRepository,
        private readonly ShiftSettingsRepositoryInterface $shiftSettingsRepository,
    ) {}

    public function index(Request $request): Response
    {
        $authUser    = $request->user();
        $trnUser     = $authUser?->TrnUser;

        if (! $trnUser) {
            abort(404, 'user not found');
        }

        $targetMonth = $this->resolveMonth($request->string('month')->toString());

        return $this->render('ShiftSchedule/Index', [
            'currentMonth'  => $targetMonth->format('Y-m'),
            'shiftEntries'  => fn () => $this->shiftScheduleRepository->getMonthlyShifts(
                $trnUser->id,
                $targetMonth,
            )->toArray(),
            'startSettings' => fn () => $this->shiftSettingsRepository->findOrDefault($trnUser->id)->toArray(),
            'shiftSync'     => fn () => session('shiftSync'),
        ]);
    }

    /**
     * 月次シフトの登録とGoogleカレンダー同期（同期実行）。
     * 将来的に非同期化する場合は syncShifts() 内でキュー投入に差し替えやすい構成にする。
     */
    public function store(ShiftStoreRequest $request): RedirectResponse
    {
        $authUser    = $request->user();
        $trnUser     = $authUser?->TrnUser;

        if (! $trnUser) {
            abort(404, 'user not found');
        }

        $data        = $request->validated();

        $command     = ShiftRegistrationCommand::fromPayloads(
            $trnUser->id,
            $authUser->email,
            $data['shifts'] ?? [],
            [
                'officeStartTime' => $data['officeStartTime'] ?? null,
                'remoteStartTime' => $data['remoteStartTime'] ?? null,
            ],
        );

        try {
            $result = $this->shiftRegistrationService->execute($command);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'shifts' => $e->getMessage(),
            ]);
        }

        $hasFailures = ! $result->failures->isEmpty();

        return redirect()
            ->back()
            ->with('status', $hasFailures ? 'stored_with_errors' : 'stored')
            ->with('shiftSync', [
                'successes' => $result->successes->toArray(),
                'failures'  => $result->failures->toArray(),
            ]);
    }

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
