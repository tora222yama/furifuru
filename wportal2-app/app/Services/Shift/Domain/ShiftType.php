<?php

declare(strict_types=1);

namespace App\Services\Shift\Domain;

enum ShiftType: string
{
    case Office       = 'office';
    case Remote       = 'remote';
    case BusinessTrip = 'businessTrip';
    case Holiday      = 'holiday';

    public function toJapanese(): string
    {
        return match ($this) {
            self::Office       => '出社',
            self::Remote       => '在宅',
            self::BusinessTrip => '出張',
            self::Holiday      => '休暇',
        };
    }
}
