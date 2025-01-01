<?php

declare(strict_types=1);

namespace App\Enum\App\ShuffleLunch;

enum ECalculate: int
{
    case INVALID            = 0; // 無効値.

    case READY              = 1; // 計算未処理.
    case ESTABLISHED        = 2; // 計算済・成立.
    case DONE_WITHOUT_LUNCH = 3; // 計算済・不成立.
}
