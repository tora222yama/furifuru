<?php

declare(strict_types=1);

namespace App\GraphQL\App\Queries\Pipe;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;

final class PipeAppPaginationQuery extends PipeBase
{
    public int $pageIndex = 0;

    public int $pageStep  = 0;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_PAGINATION_QUERY, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->pageIndex = $this->getArgAsInteger('page_index');
        $this->pageStep  = $this->getArgAsInteger('page_step');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
