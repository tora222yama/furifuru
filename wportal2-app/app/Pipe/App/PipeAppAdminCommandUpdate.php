<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;

final class PipeAppAdminCommandUpdate extends PipeBase
{
    public string $command = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_ADMIN_COMMAND_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->command = $this->getArgAsString('command');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
