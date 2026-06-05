<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enum\App\ECalendarSyncStatus;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnShiftSchedule;
use App\Models\App\Trn\TrnUser;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\FeatureTestCase;

final class ShiftScheduleApiControllerTest extends FeatureTestCase
{
    public function test_export_requires_authentication(): void
    {
        $response = $this->getJson('/api/shift_schedule/export?month=2026-05');

        $response->assertUnauthorized();
    }

    public function test_export_returns_monthly_shifts_as_json(): void
    {
        $authUser = AuthUser::factory()->create([
            'name'      => 'テスト 太郎',
            'email'     => 'api-test@example.com',
            'password'  => 'password',
            'google_id' => 'dummy-google-id',
        ]);
        $trnUser  = TrnUser::factory()->create([
            'auth_id' => $authUser->id,
        ]);

        TrnShiftSchedule::query()->create([
            'trn_user_id'            => $trnUser->id,
            'shift_date'             => '2026-05-01',
            'shift_type'             => 'office',
            'e_calendar_sync_status' => ECalendarSyncStatus::PENDING->value,
        ]);
        TrnShiftSchedule::query()->create([
            'trn_user_id'            => $trnUser->id,
            'shift_date'             => '2026-05-02',
            'shift_type'             => 'remote',
            'e_calendar_sync_status' => ECalendarSyncStatus::PENDING->value,
        ]);

        Sanctum::actingAs($authUser, ['shift_schedule:read']);

        $response = $this->getJson('/api/shift_schedule/export?month=2026-05');

        $response
            ->assertOk()
            ->assertJsonPath('month', '2026-05')
            ->assertJsonPath('meta.userCount', 1)
            ->assertJsonPath('meta.dateCount', 31)
            ->assertJsonStructure([
                'dates',
                'users' => [
                    '*' => ['name', 'email', 'shifts'],
                ],
            ])
            ->assertJsonPath('users.0.shifts.2026-05-01.shift', '出社')
            ->assertJsonPath('users.0.shifts.2026-05-02.shift', '在宅');
    }

    public function test_export_requires_shift_schedule_ability(): void
    {
        $authUser = AuthUser::factory()->create([
            'email'     => 'api-test-no-ability@example.com',
            'password'  => 'password',
            'google_id' => 'dummy-google-id',
        ]);

        Sanctum::actingAs($authUser);

        $response = $this->getJson('/api/shift_schedule/export?month=2026-05');

        $response->assertForbidden();
    }
}
