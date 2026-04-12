<?php

declare(strict_types=1);

namespace App\Services\Shift\Domain;

enum ShiftType: string
{
    case Office       = 'office';
    case Remote       = 'remote';
    case BusinessTrip = 'businessTrip';
    case Holiday      = 'holiday';
}
