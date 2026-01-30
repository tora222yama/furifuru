<?php

declare(strict_types=1);

namespace App\Models\App\Trn;

use Database\Factories\TrnUserShiftEntryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrnUserShiftEntry extends Model
{
    /** @use HasFactory<TrnUserShiftEntryFactory> */
    use HasFactory;

    protected $table    = 'trn_user_shift_entries';

    protected $fillable = [
        'user_id',
        'date',
        'type',
    ];

    protected $casts    = [
        'date' => 'date',
    ];

    /**
     * @return BelongsTo<TrnUser, $this>
     */
    public function trnUser(): BelongsTo
    {
        return $this->belongsTo(TrnUser::class, 'user_id', 'id');
    }
}
