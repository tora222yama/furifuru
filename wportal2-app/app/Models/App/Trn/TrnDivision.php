<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrnDivision extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'trn_division';

    /**
     * リレーション:TrnDivisionUser
     */
    public function TrnDivisionUser(): HasMany
    {
        return $this->hasMany(
            TrnDivisionUser::class,
            'trn_division_id',
            'id'
        )->alive();
    }

    /**
     * リレーション:TrnUserDivisionPriority
     */
    public function TrnUserDivisionPriority(): HasMany
    {
        return $this->hasMany(
            TrnUserDivisionPriority::class,
            'trn_division_id',
            'id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = []): array
    {
        return [
            'id'                      => $this->id              ?? 0,
            'name'                    => $this->name            ?? '',
            'explain'                 => $this->explain         ?? '',
            'displayOrder'            => $this->display_order   ?? 0,

            'trnDivisionUser'         => $this->isExistKeyInWith($with, 'TrnDivisionUser')
                ? $this->TrnDivisionUser->map(function (TrnDivisionUser $trnDivisionUser) use ($with) {
                    return $trnDivisionUser->toPayload($with);
                })->toArray()
                : [],

            'trnUserDivisionPriority' => $this->isExistKeyInWith($with, 'TrnUserDivisionPriority')
                ? $this->TrnUserDivisionPriority->map(function (TrnUserDivisionPriority $trnUserDivisionPriority) use ($with) {
                    return $trnUserDivisionPriority->toPayload($with);
                })->toArray()
                : [],
        ];
    }
}
