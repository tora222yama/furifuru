<?php

declare(strict_types=1);

namespace App\Models\App;

use Illuminate\Database\Eloquent\Model;
use JetBrains\PhpStorm\Pure;

class ModelBase extends Model
{
    /**
     * EloquentBuilderの拡張を行う.
     */
    #[Pure]
    public function newEloquentBuilder($query): EloquentBuilder
    {
        return new EloquentBuilder($query);
    }
}
