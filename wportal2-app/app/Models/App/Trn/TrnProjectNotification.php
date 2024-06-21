<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnProjectNotification extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'trn_project_notification';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'                     => $this->id                 ?? 0,
            'trnProjectId'           => $this->trn_project_id     ?? 0,
            'notificationType'       => $this->notification_type  ?? 0,
            'notificationValue'      => $this->notification_value ?? '',
        ];
    }
}
