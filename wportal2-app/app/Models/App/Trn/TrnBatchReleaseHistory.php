<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnBatchReleaseHistory extends ModelBase
{
    use EagerLoadHelper, hasFactory;

    protected $table = 'trn_batch_release_history';
}
