<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries;

final class Dummy
{
    public function __invoke($_, array $args): array
    {
        return [];
    }
}
