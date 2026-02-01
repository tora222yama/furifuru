<?php

declare(strict_types=1);

namespace App\ValueObjects;

use InvalidArgumentException;

final readonly class ShiftEntry
{
    public function __construct(
        public ShiftDate $date,
        public ShiftType $type,
    ) {}

    /**
     * @param  array{date?:string,type?:string}  $payload
     */
    public static function fromArray(array $payload): self
    {
        if (! isset($payload['date'], $payload['type'])) {
            throw new InvalidArgumentException('ShiftEntry requires date and type');
        }

        return new self(
            new ShiftDate($payload['date']),
            ShiftType::from($payload['type']),
        );
    }

    /**
     * @return array{date:string,type:string}
     */
    public function toArray(): array
    {
        return [
            'date' => $this->date->toDateString(),
            'type' => $this->type->value,
        ];
    }
}
