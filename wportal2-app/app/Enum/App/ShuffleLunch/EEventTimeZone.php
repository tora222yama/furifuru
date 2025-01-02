<?php

declare(strict_types=1);

namespace App\Enum\App\ShuffleLunch;

enum EEventTimeZone: int
{
    case INVALID = 0; // 無効値.

    case EARLY   = 1; // 11:30-12:30.
    case NORMAL  = 2; // 12:00-13:00.
}
