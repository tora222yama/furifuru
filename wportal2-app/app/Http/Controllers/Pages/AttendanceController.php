<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnAttendanceState;
use Carbon\Carbon;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('Attendance/Index', [
            'trnAttendanceState' => fn () => $this->getAttendanceState(),
        ]);
    }

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
