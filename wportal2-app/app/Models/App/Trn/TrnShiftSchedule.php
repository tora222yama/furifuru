<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use App\Models\App\ModelBase;
use App\Trait\EagerLoadHelper;

/**
 * @mixin TrnShiftSchedule
 *
 * @extends ModelBase<TrnShiftSchedule>
 *
 * @property int $id
 * @property int $trn_user_id
 * @property string $shift_date
 * @property string $shift_type
 * @property int $e_calendar_sync_status
 */
class TrnShiftSchedule extends ModelBase
{
    use EagerLoadHelper;

    protected $table    = 'trn_shift_schedule';

    protected $fillable = [
        'trn_user_id',
        'shift_date',
        'shift_type',
        'e_calendar_sync_status',
    ];
}
