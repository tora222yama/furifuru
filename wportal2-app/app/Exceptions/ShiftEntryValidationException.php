<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

final class ShiftEntryValidationException extends InvalidArgumentException
{
    /** @param list<array{index:int,payload:mixed,message:string}> $errors */
    public function __construct(private readonly array $errors)
    {
        parent::__construct('ShiftEntry validation failed');
    }

    /** @return list<array{index:int,payload:mixed,message:string}> */
    public function errors(): array
    {
        return $this->errors;
    }
}
