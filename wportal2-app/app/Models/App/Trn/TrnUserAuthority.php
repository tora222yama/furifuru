<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrnUserAuthority extends ModelBase
{
    use HasFactory;

    protected $table = 'trn_user_authority';
}
