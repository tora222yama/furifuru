<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin TrnAttendanceState
 *
 * @extends ModelBase<TrnAttendanceState>
 */
class TrnAttendanceState extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'trn_attendance_state';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'               => $this->id                  ?? 0,
            'trnUserId'        => $this->trn_user_id         ?? 0,
            'eAttendanceState' => $this->e_attendance_state  ?? 0,
            'createdAt'        => $this->created_at          ?? '',
            'updatedAt'        => $this->updated_at          ?? '',
        ];
    }
}
