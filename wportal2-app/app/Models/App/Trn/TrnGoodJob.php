<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Database\Factories\App\Trn\TrnGoodJobFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin TrnGoodJob
 *
 * @extends ModelBase<TrnGoodJob>
 */
class TrnGoodJob extends ModelBase
{
    /** @use HasFactory<TrnGoodJobFactory> */
    use EagerLoadHelper, HasFactory;

    protected $table = 'trn_good_job';

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
            'id'                => $this->id                   ?? 0,
            'fromTargetType'    => $this->from_target_type     ?? 0,
            'fromTrnUserId'     => $this->from_trn_user_id     ?? 0,
            'fromTrnDivisionId' => $this->from_trn_division_id ?? 0,
            'fromTrnProjectId'  => $this->from_trn_project_id  ?? 0,
            'fromOtherLabel'    => $this->from_other_label     ?? '',
            'toTargetType'      => $this->to_target_type       ?? 0,
            'toTrnUserId'       => $this->to_trn_user_id       ?? 0,
            'toTrnDivisionId'   => $this->to_trn_division_id   ?? 0,
            'toTrnProjectId'    => $this->to_trn_project_id    ?? 0,
            'toOtherLabel'      => $this->to_other_label       ?? '',
            'title'             => $this->title                ?? '',
            'content'           => $this->content              ?? '',
            'createdAt'         => $this->created_at           ?? '',
        ];
    }
}
