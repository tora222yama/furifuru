<?php

declare(strict_types=1);

namespace App\Pipe\Usecases;

use App\Enum\App\EPipeKind;
use App\Pipe\PipeBase;
use Carbon\Carbon;
use Illuminate\Support\Collection;

final class PipeUsecasesCalendarUserScheduleListQuery extends PipeBase
{
    /** @var Collection<int, string> */
    public Collection $emailList;

    public Carbon $startDate;

    public Carbon $endDate;

    /**
     * constructor.
     *
     * @param  array<mixed>  $args
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::USECASES_CALENDAR_USER_SCHEDULE_LIST, $args);
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
    public function validate(): void {}
}
