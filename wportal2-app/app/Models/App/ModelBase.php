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

    /**
     * eager-load指定に特定のキーが存在するかどうか.
     */
    protected function isExistKeyInWith(array $with, string $key): bool
    {
        // flatにして最後のピリオドから後ろを取得.
        return collect($with)->flatten()
            ->map(function ($value) {
                $pos = 0;
                if ($existPeriod = strpos($value, '.')) {
                    $pos = $existPeriod + 1;
                }

                return substr($value, $pos, strlen($value));
            })
            ->contains($key);
    }
}
