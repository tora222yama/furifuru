<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Auth;

final class PipeAppAttendanceDivisionPriority extends PipeBase
{
    public ?AuthUser $authUser;

    public int $divisionId = 0;

    public int $priority   = 0;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_ATTENDANCE_DIVISION_PRIORITY, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        // 認証ユーザー取得.
        $this->authUser          = Auth::user();

        $this->divisionId        = $this->getArgAsInteger('divisionId');
        $this->priority          = $this->getArgAsInteger('priority');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
