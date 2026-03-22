<?php

declare(strict_types=1);

namespace Tests\Fakes\Shift;

use App\Services\Shift\ShiftSettingsRepositoryInterface;
use App\ValueObjects\ShiftStartSettings;

final class FakeShiftSettingsRepository implements ShiftSettingsRepositoryInterface
{
    /** @var array<int, array{trnUserId:int,settings:ShiftStartSettings}> */
    public array $upsertCalls        = [];

    /** @var list<int> */
    public array $findOrDefaultCalls = [];

    /** @var array<int, ShiftStartSettings> */
    private array $settingsByUser    = [];

    public function upsert(int $trnUserId, ShiftStartSettings $settings): void
    {
        $this->upsertCalls[]              = [
            'trnUserId' => $trnUserId,
            'settings'  => $settings,
        ];

        $this->settingsByUser[$trnUserId] = $settings;
    }

    public function findOrDefault(int $trnUserId): ShiftStartSettings
    {
        $this->findOrDefaultCalls[] = $trnUserId;

        return $this->settingsByUser[$trnUserId] ?? ShiftStartSettings::default();
    }

    public function seed(int $trnUserId, ShiftStartSettings $settings): void
    {
        $this->settingsByUser[$trnUserId] = $settings;
    }
}
