<?php

declare(strict_types=1);

namespace App\Pipe\App\Input;

use App\Trait\GraphQLVariablesHelper;
use Carbon\Carbon;

final class InputEvent
{
    use GraphQLVariablesHelper;

    public int $uid = 0;

    public Carbon $updatedAt;

    public static function createFromArray(array $array): InputEvent
    {
        $new            = new InputEvent();

        $new->uid       = (int) $array['uid'];
        $new->updatedAt = Carbon::createFromTimeString($array['updatedAt']);

        return $new;
    }
}
