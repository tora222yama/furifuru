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

    /**
     * argumentsから真偽値の引数を取得
     */
    protected function getArgAsBoolean(string $key, ?array $args = null): bool
    {
        if ($args === null) {
            $args = $this->args;
        }

        return $args[$key] ?? false;
    }

    /**
     * argumentsから数値の引数を取得.
     */
    protected function getArgAsIntArray(string $key, ?array $args = null): array
    {
        if ($args === null) {
            $args = $this->args;
        }

        return array_map('intval', (array) $args[$key]) ?? [];
    }

    /**
     * argumentsから文字列の引数を取得.
     */
    protected function getArgAsStringArray(string $key, ?array $args = null): array
    {
        if ($args === null) {
            $args = $this->args;
        }

        return array_map('strval', (array) $args[$key]) ?? [];
    }
}
