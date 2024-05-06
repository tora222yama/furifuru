<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrnDivision extends ModelBase
{
    use hasFactory;

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
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = []): array
    {
        // TODO: リカーシブに値を確認する.
        $existTrnDivisionUser = collect($with)->contains('TrnDivisionUser');

        return [
            'id'              => $this->id              ?? 0,
            'name'            => $this->name            ?? '',
            'explain'         => $this->explain         ?? '',
            'displayOrder'    => $this->display_order   ?? 0,

            'trnDivisionUser' => $existTrnDivisionUser
                ? $this->TrnDivisionUser->map(function (TrnDivisionUser $trnDivisionUser) use ($with) {
                    return $trnDivisionUser->toPayload($with);
                })->toArray()
                : [],
        ];
    }
}
