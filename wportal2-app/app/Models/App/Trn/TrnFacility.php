<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrnFacility extends Model
{
    use HasFactory;

    protected $table = 'trn_facility';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'          => $this->id,
            'category_id' => $this->category_id ?? 0,
            'name'        => $this->name        ?? '',
            'explain'     => $this->explain     ?? '',
            'created_at'  => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
