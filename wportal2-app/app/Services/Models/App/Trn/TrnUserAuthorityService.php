<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EUserAuthority;
use App\Models\App\Trn\TrnUserAuthority;
use App\Services\Models\ModelServiceBase;
use Illuminate\Support\Collection;

class TrnUserAuthorityService extends ModelServiceBase
{
    /**
     * 指定権限を所有しているかどうか.
     */
    public function hasAuthority(
        int $trnUserId,
        Collection $authorityList
    ): bool {
        $hasList      = TrnUserAuthority::query()
            ->where('trn_user_id', $trnUserId)
            ->alive()
            ->get();

        // 特権所有の場合.
        if ($hasList->contains(function (TrnUserAuthority $trnUserAuthority) {
            return $trnUserAuthority->e_user_authority === EUserAuthority::ROOT_PRIVILEGE->value;
        })) {
            return true;
        }

        // 指定権限分チェック.
        $hasAuthority = false;
        $authorityList->each(function (EUserAuthority $authority) use (
            $hasList,
            &$hasAuthority
        ) {
            if ($hasList->contains('e_user_authority', $authority->value)) {
                $hasAuthority = true;
            }
        });

        return $hasAuthority;
    }

    /**
     * ユーザーIDと権限で検索.
     */
    public function findByUserIdAndAuthority(
        int $trnUserId,
        EUserAuthority $eUserAuthority
    ): ?TrnUserAuthority {
        return TrnUserAuthority::query()
            ->where('trn_user_id', $trnUserId)
            ->where('e_user_authority', $eUserAuthority)
            ->alive()
            ->first();
    }
}
