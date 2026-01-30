<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\App\Auth\AuthUser;
use Illuminate\Support\Facades\Hash;

class ApiTest extends FeatureTestCase
{
    /**
     * A basic feature test example.
     */
    public function test_access_api(): void
    {
        $user     = AuthUser::factory()->create([
            'email'     => 'test@example.com',
            'password'  => Hash::make('password'),
            'google_id' => 'dummy_google_id',
        ]);

        $response = $this->actingAs($user)->postJson('/api/healthcheck');

        $response->assertStatus(200);
    }
}
