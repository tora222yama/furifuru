<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use Carbon\CarbonImmutable;

interface ShiftScheduleQueryServiceInterface
{
    public function getMonthlyShifts(string $authEmail, CarbonImmutable $targetMonth): ShiftEntries;
}
