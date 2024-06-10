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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden   = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts    = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
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
    public function toPayload(array $with = []): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name        ?? '',

            'trnUser'     => $this->isExistKeyInWith($with, 'TrnUser')
                ? $this->TrnUser?->toPayload($with)
                : null,

        ];
    }
}
