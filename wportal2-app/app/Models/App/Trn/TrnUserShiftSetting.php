<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;

/**
 * @mixin TrnUserShiftSetting
 *
 * @extends ModelBase<TrnUserShiftSetting>
 *
 * @property int $id
 * @property int $trn_user_id
 * @property string $office_start_time 例: "09:00"
 * @property string $remote_start_time 例: "09:30"
 */
class TrnUserShiftSetting extends ModelBase
{
    use EagerLoadHelper;

    protected $table    = 'trn_user_shift_settings';

    protected $fillable = [
        'trn_user_id',
        'office_start_time',
        'remote_start_time',
    ];
}
