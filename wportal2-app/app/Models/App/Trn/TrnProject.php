<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrnProject extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'trn_project';

    /**
     * リレーション:TrnProjectUser
     */
    public function TrnProjectUser(): HasMany
    {
        return $this->hasMany(
            TrnProjectUser::class,
            'trn_project_id',
            'id'
        )->alive();
    }

    /**
     * リレーション:TrnUserProjectPriority
     */
    public function TrnUserProjectPriority(): HasMany
    {
        return $this->hasMany(
            TrnUserProjectPriority::class,
            'trn_project_id',
            'id'
        )->alive();
    }

    /**
     * レコードをGraphQLなどでの受け渡し用に変換.
     */
    public function toPayload(array $with = [], array $history = []): array
    {
        return [
            'id'                     => $this->id              ?? 0,
            'name'                   => $this->name            ?? '',
            'explain'                => $this->explain         ?? '',
            'displayOrder'           => $this->display_order   ?? 0,

            'trnProjectUser'         => $this->isExistKeyInWith($with, 'TrnProjectUser', $history)
                ? $this->TrnProjectUser->map(function (TrnProjectUser $trnProjectUser) use ($with, $history) {
                    return $trnProjectUser->toPayload($with, [...$history, 'TrnProjectUser']);
                })->toArray()
                : [],

            'trnUserProjectPriority' => $this->isExistKeyInWith($with, 'TrnUserProjectPriority', $history)
                ? $this->TrnUserProjectPriority->map(function (TrnUserProjectPriority $trnUserProjectPriority) use ($with, $history) {
                    return $trnUserProjectPriority->toPayload($with, [...$history, 'TrnUserProjectPriority']);
                })->toArray()
                : [],
        ];
    }
}
