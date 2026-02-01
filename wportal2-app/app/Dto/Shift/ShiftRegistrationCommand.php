<?php

declare(strict_types=1);

namespace App\Dto\Shift;

final readonly class ShiftRegistrationCommand
{
    public function __construct(
        public int $trnUserId,
        public string $authEmail,
        /** @var array<int, array{date:string,type:string}> */
        public array $shifts,
    ) {}

    /**
     * @param  array<int, array{date:string,type:string}>  $shiftPayloads
     */
    public static function fromPayloads(int $trnUserId, string $authEmail, array $shiftPayloads): self
    {
        return new self($trnUserId, $authEmail, $shiftPayloads);
    }
}
