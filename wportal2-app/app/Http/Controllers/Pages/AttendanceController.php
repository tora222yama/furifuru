<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnAttendanceStateService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnProject;
use App\Models\App\Trn\TrnUser;
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
            // プロジェクト情報.
            'trnProjectList'     => fn () => $this->getProjectList([
                'TrnProjectUser',
                'TrnUserProjectPriority' => function ($query) {
                    return $query->where(
                        'trn_user_id',
                        $this->authUser->TrnUser->id,
                    );
                },
            ]),

            // ユーザー情報.
            'trnUserList'        => fn () => $this->getUserList([
                'TrnAttendanceState' => function ($query) {
                    $query->whereDate('updated_at', Carbon::now());
                },
            ]),
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
     * プロジェクト情報の取得.
     */
    private function getProjectList(array $with = []): array
    {
        // TODO: サービスへ移動.
        $trnProjectList = TrnProject::query()
            ->with($with)
            ->alive()
            ->get();

        return $trnProjectList->map(function (TrnProject $trnProject) use ($with) {
            return $trnProject->toPayload($with);
        })->toArray();
    }

    /**
     * ユーザー情報の取得.
     */
    private function getUserList(array $with = []): array
    {
        // TODO: サービスへ移動.
        $trnUserList = TrnUser::query()
            ->with($with)
            ->alive()
            ->get();

        return $trnUserList->map(function (TrnUser $trnUser) use ($with) {
            return $trnUser->toPayload($with);
        })->toArray();
    }
}
