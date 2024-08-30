<?php

declare(strict_types=1);

namespace App\Models\App\Auth;

use App\Models\App\EloquentBuilder;
use App\Models\App\Trn\TrnUser;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use JetBrains\PhpStorm\Pure;

class AuthUser extends Authenticatable
{
    use EagerLoadHelper, HasFactory, Notifiable;

    protected $table    = 'auth_user';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'sp_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden   = [
        'password',
        'remember_token',
        'sp_password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts    = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'sp_password'       => 'hashed',
    ];

    /**
     * EloquentBuilderの拡張を行う.
     */
    #[Pure]
    public function newEloquentBuilder($query): EloquentBuilder
    {
        return new EloquentBuilder($query);
    }

    /**
     * リレーション:TrnUser
     */
    public function TrnUser(): HasOne
    {
        return $this->hasOne(
            TrnUser::class,
            'auth_id',
            'id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name                  ?? '',
            'email'              => $this->email                 ?? '',
            'eEnableLegacyLogin' => $this->e_enable_legacy_login ?? 0,
            'eEnableSpLogin'     => $this->e_enable_sp_login     ?? 0,
            'spLoginFailedCount' => $this->spLoginFailedCount    ?? 0,

            'trnUser'            => $this->isExistKeyInWith($with, 'TrnUser', $history)
                ? $this->TrnUser?->toPayload($with, [...$history, 'TrnUser'])
                : null,

        ];
    }
}
