<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;

final class PipeAppProjectUpdate extends PipeBase
{
    public int $trnProjectId  = 0;

    public string $name       = '';

    public string $explain    = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_PROJECT_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->trnProjectId  = $this->getArgAsInteger('trnProjectId');
        $this->name          = $this->getArgAsString('name');
        $this->explain       = $this->getArgAsString('explain');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
