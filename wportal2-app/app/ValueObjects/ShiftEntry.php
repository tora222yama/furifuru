<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Enum\App\ECalendarSyncStatus;
use InvalidArgumentException;

final readonly class ShiftEntry
{
    public function __construct(
        public ShiftDate $date,
        public ShiftType $type,
        public ?ECalendarSyncStatus $syncStatus = null,
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
     * @return array{date:string,type:string,syncStatus?:string}
     */
    public function toArray(): array
    {
        $arr   = [
            'date' => $this->date->toDateString(),
            'type' => $this->type->value,
        ];

        $label = $this->syncStatusLabel();
        if ($label !== null) {
            $arr['syncStatus'] = $label;
        }

        return $arr;
    }

    private function syncStatusLabel(): ?string
    {
        return match ($this->syncStatus) {
            ECalendarSyncStatus::PENDING => 'pending',
            ECalendarSyncStatus::SYNCED  => 'synced',
            ECalendarSyncStatus::FAILED  => 'failed',
            default                      => null,
        };
    }
}
