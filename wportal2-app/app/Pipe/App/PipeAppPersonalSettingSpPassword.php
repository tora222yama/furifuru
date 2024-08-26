<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Pipe\PipeBase;

final class PipeAppPersonalSettingSpPassword extends PipeBase
{
    public string $password = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_PERSONAL_SETTING_SP_PASSWORD, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->password = $this->getArgAsString('password');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
