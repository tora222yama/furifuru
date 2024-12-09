<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\External\SlackService;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnAttendanceStateService;
use App\Facades\Models\App\Trn\TrnUserDivisionPriorityService;
use App\Facades\Models\App\Trn\TrnUserProjectPriorityService;
use App\Facades\Models\App\Trn\TrnUserRewardService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnDivision;
use App\Models\App\Trn\TrnProject;
use App\Models\App\Trn\TrnUser;
use App\Pipe\App\PipeAppAttendanceCreate;
use App\Pipe\App\PipeAppAttendanceDelete;
use App\Pipe\App\PipeAppAttendanceDivisionPriority;
use App\Pipe\App\PipeAppAttendanceProjectPriority;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Ramsey\Collection\Collection;
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

            // 課情報.
            'trnDivisionList'    => fn () => $this->getDivisionList([
                'TrnDivisionUser',
                'TrnUserDivisionPriority' => function ($query) {
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
            new PipeAppAttendanceCreate($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // 出退勤状態の削除.
            TrnAttendanceStateService::updateByPipe();

            // Slackへの通知.
            SlackService::updateByPipe();

            // 報酬獲得の処理.
            TrnUserRewardService::updateByPipe();
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
            new PipeAppAttendanceDelete($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // 出退勤状態の削除.
            TrnAttendanceStateService::updateByPipe();
        });

        return redirect()->action(EPages::ATTENDANCE->getInvokePath());
    }

    /**
     * プロジェクト優先度変更.
     *
     * @throws Throwable
     */
    public function project_priority(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppAttendanceProjectPriority($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // プロジェクト優先度の変更.
            TrnUserProjectPriorityService::updateByPipe();
        });

        return redirect()->action(EPages::ATTENDANCE->getInvokePath());
    }

    /**
     * 課優先度変更.
     *
     * @throws Throwable
     */
    public function division_priority(Request $request): RedirectResponse
    {
        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppAttendanceDivisionPriority($request->toArray())
        );

        // 更新処理.
        DB::transaction(static function (): void {
            // 課優先度の変更.
            TrnUserDivisionPriorityService::updateByPipe();
        });

        return redirect()->action(EPages::ATTENDANCE->getInvokePath());
    }

    /**
     * プロジェクト情報の取得.
     */
    private function getProjectList(array $with = []): array
    {
        // TODO: サービスへ移動
        /** @var Collection<TrnProject> $trnProjectList */
        $trnProjectList = TrnProject::query()
            ->with($with)
            ->alive()
            ->get();

        return $trnProjectList->map(function (TrnProject $trnProject) use ($with) {
            return $trnProject->toPayload($with);
        })->toArray();
    }

    /**
     * 課情報の取得.
     */
    private function getDivisionList(array $with = []): array
    {
        // TODO: サービスへ移動
        /** @var Collection<TrnDivision> $trnDivisionList */
        $trnDivisionList = TrnDivision::query()
            ->with($with)
            ->alive()
            ->get();

        return $trnDivisionList->map(function (TrnDivision $trnDivision) use ($with) {
            return $trnDivision->toPayload($with);
        })->toArray();
    }

    /**
     * ユーザー情報の取得.
     */
    private function getUserList(array $with = []): array
    {
        // TODO: サービスへ移動
        /** @var Collection<TrnUser> $trnUserList */
        $trnUserList = TrnUser::query()
            ->with($with)
            ->alive()
            ->get();

        return $trnUserList->map(function (TrnUser $trnUser) use ($with) {
            return $trnUser->toPayload($with);
        })->toArray();
    }
}
