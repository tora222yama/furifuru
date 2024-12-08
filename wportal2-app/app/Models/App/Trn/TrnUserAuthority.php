<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Enum\App\EUserAuthority;
use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin TrnUserAuthority
 *
 * @extends ModelBase<TrnUserAuthority>
 */
class TrnUserAuthority extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user_authority';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'               => $this->id                ?? 0,
            'trnUserId'        => $this->trn_user_id       ?? 0,
            'eUserAuthority'   => $this->e_user_authority  ?? EUserAuthority::INVALID->value,
        ];
    }
}
