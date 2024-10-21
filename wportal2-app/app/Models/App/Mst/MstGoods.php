<?php

declare(strict_types=1);

namespace App\Models\App\Mst;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MstGoods extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'mst_goods';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name            ?? '',
            'explain'   => $this->explain         ?? '',
            'comment'   => $this->comment         ?? '',
            'category'  => $this->category        ?? 0,
            'imagePath' => $this->image_path      ?? '',
            'price'     => $this->price           ?? 0,
        ];
    }
}
