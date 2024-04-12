<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\GraphQL\PipeBase;

final class PipeAppLoginFormLogin extends PipeBase
{
    public string $email    = '';

    public string $password = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::APP_LOGIN_FORM_LOGIN, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->email    = $this->getArgAsString('email');
        $this->password = $this->getArgAsString('password');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
    }
}
