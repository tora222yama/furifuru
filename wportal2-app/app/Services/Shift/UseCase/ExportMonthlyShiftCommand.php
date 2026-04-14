<?php

declare(strict_types=1);

namespace App\Services\Shift\UseCase;

use Carbon\CarbonImmutable;

final readonly class ExportMonthlyShiftCommand
{
    public function __construct(
        public CarbonImmutable $targetMonth,
    ) {}
}
