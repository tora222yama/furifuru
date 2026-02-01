<?php

declare(strict_types=1);

namespace App\Dto\Shift;

use App\Collections\ShiftEntries;

final readonly class ShiftSyncResult
{
    public function __construct(
        public ShiftEntries $successes,
        public ShiftEntries $failures,
    ) {}
}
