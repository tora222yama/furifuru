<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EUserAuthority;
use App\Models\App\Trn\TrnUserAuthority;
use App\Services\Models\ModelServiceBase;

class TrnUserAuthorityService extends ModelServiceBase
{
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
