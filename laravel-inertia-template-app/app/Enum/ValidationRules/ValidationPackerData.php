<?php

declare(strict_types=1);

namespace App\Enum\ValidationRules;

use Illuminate\Support\Collection;

/**
 * バリデーション情報１セット
 */
final class ValidationPackerData
{
    public string $tag        = '';

    public string $columnName = '';

    public mixed $value       = null;

    public Collection $ruleSetList;

    /**
     * constructor.
     */
    public function __construct(
        string $tag,
        string $columnName,
        mixed $value,
        Collection $ruleSetList
    ) {
        $this->tag         = $tag;
        $this->columnName  = $columnName;
        $this->value       = $value;
        $this->ruleSetList = $ruleSetList;
    }
}
