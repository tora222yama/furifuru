<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enum\App\EUserAuthority;
use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnUser;
use App\Models\App\Trn\TrnUserAuthority;
use Tests\Feature\FeatureTestCase;

final class ApiTokenManagementControllerTest extends FeatureTestCase
{
    public function test_index_requires_admin_privilege(): void
    {
        $authUser = $this->createWebUser();

        $response = $this
            ->actingAs($authUser, 'web')
            ->get('/admin/api-tokens');

        $response->assertNotFound();
    }

    public function test_index_is_accessible_with_admin_privilege(): void
    {
        $authUser = $this->createWebUser(EUserAuthority::ADMIN_PRIVILEGE);

        $response = $this
            ->actingAs($authUser, 'web')
            ->get('/admin/api-tokens');

        $response->assertOk();
    }

    public function test_issue_creates_token_for_admin_user(): void
    {
        $authUser = $this->createWebUser(EUserAuthority::ADMIN_PRIVILEGE);

        $response = $this
            ->actingAs($authUser, 'web')
            ->post('/admin/api-tokens/issue');

        $response->assertRedirect(route('admin.api-tokens.show'));
        $response->assertSessionHas('api_token_plain');
        $this->assertSame(1, $authUser->tokens()->count());
        $this->assertSame(['shift_schedule:read'], $authUser->tokens()->firstOrFail()->abilities);
    }

    public function test_issue_is_blocked_when_token_already_exists(): void
    {
        $authUser = $this->createWebUser(EUserAuthority::ADMIN_PRIVILEGE);
        $authUser->createToken('既存トークン', ['shift_schedule:read']);

        $response = $this
            ->actingAs($authUser, 'web')
            ->post('/admin/api-tokens/issue');

        $response->assertRedirect(route('admin.api-tokens.index'));
        $response->assertSessionHas('error');
        $this->assertSame(1, $authUser->tokens()->count());
    }

    public function test_issue_is_not_available_without_admin_privilege(): void
    {
        $authUser = $this->createWebUser();

        $response = $this
            ->actingAs($authUser, 'web')
            ->post('/admin/api-tokens/issue');

        $response->assertNotFound();
    }

    private function createWebUser(?EUserAuthority $authority = null): AuthUser
    {
        $authUser = AuthUser::factory()->create([
            'email'     => fake()->unique()->safeEmail(),
            'password'  => 'password',
            'google_id' => 'dummy-google-id',
        ]);

        $trnUser  = TrnUser::factory()->create([
            'auth_id' => $authUser->id,
        ]);

        if ($authority !== null) {
            $trnUserAuthority = new TrnUserAuthority;
            $trnUserAuthority->forceFill([
                'trn_user_id'      => $trnUser->id,
                'e_user_authority' => $authority->value,
            ]);
            $trnUserAuthority->save();
        }

        return $authUser;
    }
}
