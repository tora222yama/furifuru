<?php

declare(strict_types=1);

namespace App\Services\Shift\Domain;

interface ShiftSettingsRepositoryInterface
{
    public function upsert(int $trnUserId, ShiftStartSettings $settings): void;

    public function findOrDefault(int $trnUserId): ShiftStartSettings;
}
