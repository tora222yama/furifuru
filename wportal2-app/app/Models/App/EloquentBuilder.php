<?php

declare(strict_types=1);

namespace App\Models\App;

use App\Enum\App\EArchiveLevel;
use Illuminate\Database\Eloquent\Builder;

/**
 * EloquentBuilder拡張.
 */
class EloquentBuilder extends Builder
{
    public function alive(): self
    {
        return $this->where('e_archive_level', EArchiveLevel::ALIVE);
    }

    /**
     * 対象をアーカイブにする.
     */
    public function archive(): void
    {
        $this->update([
            'e_archive_level' => EArchiveLevel::ARCHIVE,
        ]);
    }
}
