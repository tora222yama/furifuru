<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;
use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Auth;

final class PipeAppAttendanceProjectPriority extends PipeBase
{
    public ?AuthUser $authUser;

    public int $projectId = 0;

    public int $priority  = 0;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_ATTENDANCE_PROJECT_PRIORITY, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        // 認証ユーザー取得.
        $this->authUser         = Auth::user();

        $this->projectId        = $this->getArgAsInteger('projectId');
        $this->priority         = $this->getArgAsInteger('priority');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
