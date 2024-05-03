<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnUserSlackProfile extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user_slack_profile';

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(): array
    {
        return [
            'id'              => $this->id              ?? 0,
            'trnUserId'       => $this->trn_user_id       ?? 0,
            'slackUserId'     => $this->slack_user_id     ?? '',
            'slackUserName'   => $this->slack_user_name   ?? '',
            'slackTeamId'     => $this->slack_team_id     ?? '',
        ];
    }
}
