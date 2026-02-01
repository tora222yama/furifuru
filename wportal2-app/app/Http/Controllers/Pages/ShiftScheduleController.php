<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Dto\Shift\ShiftRegistrationCommand;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShiftStoreRequest;
use App\Services\Shift\ShiftRegistrationUseCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use InvalidArgumentException;

class ShiftScheduleController extends Controller
{
    public function __construct(private readonly ShiftRegistrationUseCase $shiftRegistrationService) {}

    public function invoke(): Response
    {
        return $this->render('ShiftSchedule/Index', [
            // シフト管理画面
            'testProps' => 'testValue',
        ]);
    }

    /**
     * 月次シフトの登録とGoogleカレンダー同期（同期実行）。
     * 将来的に非同期化する場合は syncShifts() 内でキュー投入に差し替えやすい構成にする。
     */
    public function store(ShiftStoreRequest $request): RedirectResponse
    {
        $authUser = $request->user();
        $trnUser  = $authUser?->TrnUser;

        if (! $trnUser) {
            abort(404, 'user not found');
        }

        $data     = $request->validated();

        $command  = ShiftRegistrationCommand::fromPayloads(
            $trnUser->id,
            $authUser->email,
            $data['shifts'] ?? [],
        );

        try {
            $failedShifts = $this->shiftRegistrationService->execute($command);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'shifts' => $e->getMessage(),
            ]);
        }

        return redirect()
            ->back()
            ->with('status', $failedShifts->isEmpty() ? 'stored' : 'stored_with_errors')
            ->with('failedShifts', $failedShifts->toArray());
    }
}
