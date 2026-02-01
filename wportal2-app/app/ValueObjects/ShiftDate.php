<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use InvalidArgumentException;

final readonly class ShiftDate
{
    private CarbonImmutable $value;

    public function __construct(string $date)
    {
        $parsed      = CarbonImmutable::createFromFormat('Y-m-d', $date);

        if (! $parsed || $parsed->format('Y-m-d') !== $date) {
            throw new InvalidArgumentException('ShiftDate must be a valid date string (Y-m-d)');
        }

        $this->value = $parsed;
    }

    public function toCarbon(): Carbon
    {
        return Carbon::createFromImmutable($this->value);
    }

    public function toDateString(): string
    {
        return $this->value->toDateString();
    }
}
