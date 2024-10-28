<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Pipe\PipeBase;

final class PipeAppShopLunchTicket extends PipeBase
{
    public int $mstGoodsId = 0;

    public string $target  = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_SHOP_LUNCH_TICKET, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->mstGoodsId = $this->getArgAsInteger('mstGoodsId');
        $this->target     = $this->getArgAsString('target');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
