<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Pipe\PipeBase;
use Carbon\Carbon;
use Illuminate\Support\Collection;

final class PipeAppCalendarUserScheduleListQuery extends PipeBase
{
    public Collection $emailList;

    public Carbon $startDate;

    public Carbon $endDate;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_CALENDAR_USER_SCHEDULE_LIST, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->emailList = collect($this->getArgAsStringArray('emailList'));
        $this->startDate = Carbon::parse($this->getArgAsString('startDate'));
        $this->endDate   = Carbon::parse($this->getArgAsString('endDate'));
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
