<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\Enum\ValidationRules\ValidationPacker;
use App\Pipe\PipeBase;
use Illuminate\Support\Facades\Log;

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
        $packer    = new ValidationPacker();

        // パスワード.
        $packer->addValidation(
            'password',
            'パスワード',
            $this->password,
            collect([
                EValidationType::SIMPLE_PASSWORD->ruleSet(),
            ])
        );

        // バリデーションの実施.
        $validator = $packer->makeValidator();
        if ($validator->fails()) {
            $this->errors = $validator->errors();
            Log::info(print_r($this->errors, true));
        }
    }
}
