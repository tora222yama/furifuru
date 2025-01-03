<?php

declare(strict_types=1);

namespace App\Console\Commands\Batch\ShuffleLunchMatching;

use App\Enum\App\ShuffleLunch\EGroupType;

class Group
{
    private EGroupType $group = EGroupType::INVALID;

    public function __construct(EGroupType $group)
    {
        $this->group = $group;
    }

    public function getGroupType(): EGroupType
    {
        return $this->group;
    }
}
