<?php

declare(strict_types=1);

namespace App\Services\Shift\UseCase;

use App\Services\Shift\Domain\ShiftStartSettings;

final readonly class ShiftRegistrationCommand
{
    public function __construct(
        public int $trnUserId,
        public string $authEmail,
        /** @var array<int, array{date:string,type:string}> */
        public array $shifts,
        public ShiftStartSettings $startSettings,
    ) {}

    /**
     * @param  array<int, array{date:string,type:string}>  $shiftPayloads
     * @param  array{officeStartTime?:string,remoteStartTime?:string}  $startSettingsPayload
     */
    public static function fromPayloads(int $trnUserId, string $authEmail, array $shiftPayloads, array $startSettingsPayload = []): self
    {
        return new self(
            $trnUserId,
            $authEmail,
            $shiftPayloads,
            ShiftStartSettings::fromArray($startSettingsPayload),
        );
    }
}
