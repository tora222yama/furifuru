<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TrnUser extends ModelBase
{
    use EagerLoadHelper, HasFactory;

    protected $table = 'trn_user';

    /**
     * リレーション:TrnAttendanceState
     */
    public function TrnAttendanceState(): HasMany
    {
        return $this->hasMany(
            TrnAttendanceState::class,
            'trn_user_id',
            'id'
        )->alive();
    }

    /**
     *  リレーション:TrnUserSlackProfile
     */
    public function TrnUserSlackProfile(): HasOne
    {
        return $this->hasOne(
            TrnUserSlackProfile::class,
            'trn_user_id',
            'id'
        )->alive();
    }

    /**
     *  リレーション:TrnUserDivisionPriority
     */
    public function TrnUserDivisionPriority(): HasMany
    {
        return $this->hasMany(
            TrnUserDivisionPriority::class,
            'trn_user_id',
            'id'
        )->alive();
    }

    /**
     *  リレーション:TrnUserProjectPriority
     */
    public function TrnUserProjectPriority(): HasMany
    {
        return $this->hasMany(
            TrnUserProjectPriority::class,
            'trn_user_id',
            'id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'                  => $this->id                ?? 0,
            'authId'              => $this->auth_id           ?? 0,
            'nickname'            => $this->nickname          ?? '',
            'faceImagePath'       => $this->face_image_path   ?? '',

            'trnAttendanceState'  => $this->isExistKeyInWith($with, 'TrnAttendanceState', $history)
                ? $this->TrnAttendanceState->map(function (TrnAttendanceState $trnAttendanceState) use ($with, $history) {
                    return $trnAttendanceState->toPayload($with, [...$history, 'TrnAttendanceState']);
                })->toArray()
                : [],

            'trnUserSlackProfile' => $this->isExistKeyInWith($with, 'TrnUserSlackProfile')
                ? $this->TrnUserSlackProfile?->toPayload($with, [...$history, 'TrnUserSlackProfile'])
                : null,
        ];
    }
}
