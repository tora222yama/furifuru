<?php

declare(strict_types=1);

namespace App\Dto\Shift;

use Carbon\CarbonImmutable;

final readonly class SyncShiftCalendarCommand
{
    public function __construct(
        public int $trnUserId,
        public string $authEmail,
        public CarbonImmutable $targetMonth,
    ) {}
}
