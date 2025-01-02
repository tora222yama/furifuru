<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;

/**
 * @mixin TrnShuffleLunchEntry
 *
 * @extends ModelBase<TrnShuffleLunchEntry>
 */
class TrnShuffleLunchEntry extends ModelBase
{
    use EagerLoadHelper;

    protected $table = 'trn_shuffle_lunch_entry';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     *
     * @param  array<mixed>  $with
     * @param  array<string>  $history
     * @return array<mixed>
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'            => $this->id                 ?? 0,
            'trnUserId'     => $this->trn_user_id        ?? 0,
            'eventDate'     => $this->event_date         ?? '',
            'eventTimeZone' => $this->event_time_zone    ?? 0,
        ];
    }
}
