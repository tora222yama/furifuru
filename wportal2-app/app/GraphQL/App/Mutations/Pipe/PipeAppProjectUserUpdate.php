<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;
use Illuminate\Support\Collection;

final class PipeAppProjectUserUpdate extends PipeBase
{
    public int $trnProjectId = 0;

    public ?Collection $trnUserIdList;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_PROJECT_USER_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->trnProjectId  = $this->getArgAsInteger('trnProjectId');
        $this->trnUserIdList = collect(
            $this->getArgAsIntArray('trnUserIdList')
        );
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
