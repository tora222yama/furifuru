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
        return collect($this->flatEagerLoad($with))
            ->filter(function ($value) {
                return is_string($value);
            })
            ->map(function ($value) {
                $pos = 0;
                if ($existPeriod = strpos($value, '.')) {
                    $pos = $existPeriod + 1;
                }

                return substr($value, $pos, strlen($value));
            })
            ->contains($key);
    }

    /**
     * eager-load情報をrecursiveにflatmapとする.
     */
    private function flatEagerLoad(array $with, array &$ret = []): array
    {
        foreach ($with as $key => $item) {
            // 文字列の時は検索対象として終了.
            if (is_string($item)) {
                $ret[] = $item;

                continue;
            }

            // 配列の時は再帰的に処理する.
            if (is_array($item)) {
                $this->flatEagerLoad($item, $ret);

                continue;
            }

            // Closureなどの場合はキーを対象とする.
            if (is_object($item)) {
                $ret[] = $key;
            }
        }

        return $ret;
    }
}
