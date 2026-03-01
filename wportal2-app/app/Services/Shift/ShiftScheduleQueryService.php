<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use Carbon\CarbonImmutable;

final readonly class ShiftScheduleQueryService
{
    public function __construct(private ShiftScheduleRepositoryInterface $shiftScheduleRepository) {}

    public function getMonthlyShifts(int $trnUserId, CarbonImmutable $targetMonth): ShiftEntries
    {
        return $this->shiftScheduleRepository->getMonthlyShifts($trnUserId, $targetMonth);
    }
}
