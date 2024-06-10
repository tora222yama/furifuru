<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnUserProjectPriority extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user_project_priority';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = []): array
    {
        return [
            'id'              => $this->id               ?? 0,
            'trnUserId'       => $this->trn_user_id      ?? 0,
            'trnProjectId'    => $this->trn_project_id   ?? 0,
            'projectPriority' => $this->project_priority ?? 0,
        ];
    }
}
