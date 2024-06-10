<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;
use Illuminate\Support\Collection;

final class PipeAppDivisionUserUpdate extends PipeBase
{
    public int $trnDivisionId = 0;

    public ?Collection $trnUserIdList;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_DIVISION_USER_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->trnDivisionId = $this->getArgAsInteger('trnDivisionId');
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
