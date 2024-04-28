<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries\Pipe;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;

final class PipeAppRedisQuery extends PipeBase
{
    public string $sampleArgument = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_REDIS_QUERY, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->sampleArgument = $this->getArgAsString('sample_argument');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
