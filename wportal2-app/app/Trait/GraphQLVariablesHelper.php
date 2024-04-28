<?php

declare(strict_types=1);

namespace App\Trait;

trait GraphQLVariablesHelper
{
    protected array $args = [];

    /**
     * argumentsから数値の引数を取得.
     */
    protected function getArgAsInteger(string $key, ?array $args = null): int
    {
        if ($args === null) {
            $args = $this->args;
        }

        return (int) $args[$key] ?? 0;
    }

    /**
     * argumentsから文字列の引数を取得
     */
    protected function getArgAsString(string $key, ?array $args = null): string
    {
        if ($args === null) {
            $args = $this->args;
        }

        return $args[$key] ?? '';
    }
}
