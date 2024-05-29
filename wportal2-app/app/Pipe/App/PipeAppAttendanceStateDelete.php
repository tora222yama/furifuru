<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Auth;

final class PipeAppAttendanceStateDelete extends PipeBase
{
    public ?AuthUser $authUser;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_ATTENDANCE_STATE_DELETE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
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
