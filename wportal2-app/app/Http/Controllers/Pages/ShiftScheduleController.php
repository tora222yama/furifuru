<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Dto\Shift\ShiftRegistrationCommand;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShiftStoreRequest;
use App\Services\Shift\ShiftRegistrationUseCase;
use App\Services\Shift\ShiftScheduleQueryService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use InvalidArgumentException;

class ShiftScheduleController extends Controller
{
    public function __construct(
        private readonly ShiftRegistrationUseCase $shiftRegistrationService,
        private readonly ShiftScheduleQueryService $shiftScheduleQueryService,
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
            'shiftEntries'  => fn () => $this->shiftScheduleQueryService->getMonthlyShifts(
                $trnUser->id,
                $targetMonth,
            )->toArray(),
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

    private function resolveMonth(?string $month): CarbonImmutable
    {
        if ($month === null || $month === '') {
            return CarbonImmutable::now()->startOfMonth();
        }

        $parsed = CarbonImmutable::createFromFormat('Y-m', $month);

        if ($parsed === null) {
            return CarbonImmutable::now()->startOfMonth();
        }

        return $parsed->startOfMonth();
    }
}
