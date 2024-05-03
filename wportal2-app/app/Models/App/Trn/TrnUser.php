<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TrnUser extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user';

    public function TrnUserSlackProfile(): HasOne
    {
        return $this->hasOne(
            TrnUserSlackProfile::class,
            'trn_user_id',
            'id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'              => $this->id                ?? 0,
            'authId'          => $this->auth_id           ?? 0,
            'nickname'        => $this->nickname          ?? '',
            'faceImagePath'   => $this->face_image_path   ?? '',
        ];
    }
}
