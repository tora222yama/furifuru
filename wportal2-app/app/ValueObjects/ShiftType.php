<?php

declare(strict_types=1);

namespace App\ValueObjects;

enum ShiftType: string
{
    case Office       = 'office';
    case Remote       = 'remote';
    case BusinessTrip = 'businessTrip';
    case Holiday      = 'holiday';
}
