<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnAttendanceStateService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnAttendanceState;
use App\Pipe\App\PipeAppAttendanceStateCreate;
use App\Pipe\App\PipeAppAttendanceStateDelete;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Throwable;

class AttendanceController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('Attendance/Index', [
            'trnAttendanceState' => fn () => $this->getAttendanceState(),
        ]);
    }

    /**
     * 出退勤状態の追加.
     *
     * @throws Throwable
     */
    public function create(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppAttendanceStateCreate($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // 出退勤状態の削除.
            TrnAttendanceStateService::updateByPipe();

            // TODO: Slackへの通知.
        });

        return redirect()->action(EPages::ATTENDANCE->getInvokePath());
    }

    /**
     * 直近の出退勤情報を削除.
     *
     * @throws Throwable
     */
    public function delete(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppAttendanceStateDelete($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // 出退勤状態の削除.
            TrnAttendanceStateService::updateByPipe();
        });

        return redirect()->action(EPages::ATTENDANCE->getInvokePath());
    }

    /**
     * 出退勤情報の取得.
     */
    private function getAttendanceState(array $with = []): array
    {
        $trnAttendanceStateList = TrnAttendanceState::query()
            ->with($with)
            //->where('trn_user_id', $this->authUser->TrnUser->id)
            ->whereDate('updated_at', Carbon::now())
            ->alive()
            ->get();

        return $trnAttendanceStateList->map(function (TrnAttendanceState $trnAttendanceState) use ($with) {
            return $trnAttendanceState->toPayload($with);
        })->toArray();
    }
}
