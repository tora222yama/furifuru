<?php

declare(strict_types=1);

namespace App\Enum\Mst;

/**
 * 商品の種別.
 */
enum EMstGoods: int
{
    case INVALID                    = 0; // 指定なし.
    case LUNCH_TICKET_TOBARU_LOW    = 1; // ランチチケット・桃原LOW.
    case LUNCH_TICKET_TOBARU_MIDDLE = 2; // ランチチケット・桃原MIDDLE.
    case LUNCH_TICKET_TOBARU_HIGH   = 3; // ランチチケット・桃原HIGH.
}
