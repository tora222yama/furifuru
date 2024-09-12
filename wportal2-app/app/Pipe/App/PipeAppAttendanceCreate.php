<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EAttendanceState;
use App\Enum\App\EPipeKind;
use App\Models\App\Auth\AuthUser;
use App\Pipe\PipeBase;
use Auth;
use Illuminate\Support\Collection;

final class PipeAppAttendanceCreate extends PipeBase
{
    public EAttendanceState $eAttendanceState = EAttendanceState::INVALID;

    public ?AuthUser $authUser;

    public ?Collection $todayAttendanceStateList;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_ATTENDANCE_CREATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->eAttendanceState = EAttendanceState::tryFrom(
            $this->getArgAsInteger('eAttendanceState')
        );

        // 認証ユーザー取得.
        $this->authUser         = Auth::user();
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
