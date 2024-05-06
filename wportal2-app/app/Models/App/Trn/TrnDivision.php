<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnDivision extends ModelBase
{
    use hasFactory;

    protected $table = 'trn_division';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'            => $this->id              ?? 0,
            'name'          => $this->name            ?? '',
            'explain'       => $this->explain         ?? '',
            'displayOrder'  => $this->display_order   ?? 0,
        ];
    }
}
