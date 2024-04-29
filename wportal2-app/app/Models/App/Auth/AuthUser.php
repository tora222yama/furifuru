<?php

declare(strict_types=1);

namespace App\Models\App\Auth;

use App\Models\App\EloquentBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use JetBrains\PhpStorm\Pure;

class AuthUser extends Authenticatable
{
    use HasFactory, Notifiable;

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
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name        ?? '',
        ];
    }
}
