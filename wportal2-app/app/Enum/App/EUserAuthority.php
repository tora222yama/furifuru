<?php

declare(strict_types=1);

namespace App\Enum\App;

/**
 * ユーザー権限
 *
 * @note 値の変更禁止.
 */
enum EUserAuthority: int
{
    case INVALID        = 0; // 無効.

    case ROOT_PRIVILEGE = 1; // 完全特権.
}
