<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnUser extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'              => $this->id              ?? 0,
            'auth_id'         => $this->auth_id         ?? 0,
            'nickname'        => $this->nickname        ?? '',
            'face_image_path' => $this->face_image_path ?? '',
        ];
    }
}
