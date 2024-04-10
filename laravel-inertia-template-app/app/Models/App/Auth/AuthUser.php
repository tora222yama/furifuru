<?php

declare(strict_types=1);

namespace App\Models\App\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class AuthUser extends Authenticatable
{
    use HasFactory;

    protected $table    = 'auth_user';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'pwd',
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
}
