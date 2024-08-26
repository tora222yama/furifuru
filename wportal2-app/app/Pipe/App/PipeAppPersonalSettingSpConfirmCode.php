<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Pipe\PipeBase;

final class PipeAppPersonalSettingSpConfirmCode extends PipeBase
{
    public string $code = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_PERSONAL_SETTING_SP_CONFIRM_CODE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->code = $this->getArgAsString('code');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
