<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnDivisionUser extends ModelBase
{
    use hasFactory;

    protected $table = 'trn_division_user';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'            => $this->id              ?? 0,
            'trnDivisionId' => $this->trn_division_id ?? 0,
            'trnUserId'     => $this->trn_user_id     ?? 0,
        ];
    }
}
