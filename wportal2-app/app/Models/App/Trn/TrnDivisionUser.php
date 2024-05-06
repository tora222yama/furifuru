<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TrnDivisionUser extends ModelBase
{
    use hasFactory;

    protected $table = 'trn_division_user';

    /**
     * リレーション:TrnUser
     */
    public function TrnUser(): HasOne
    {
        return $this->hasOne(
            TrnUser::class,
            'id',
            'trn_user_id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = []): array
    {
        // TODO: リカーシブに値を確認する.
        $existTrnUser = true;

        return [
            'id'            => $this->id              ?? 0,
            'trnDivisionId' => $this->trn_division_id ?? 0,
            'trnUserId'     => $this->trn_user_id     ?? 0,

            'trnUser'       => $existTrnUser
                ? $this->TrnUser->toPayload($with)
                : null,
        ];
    }
}
