<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\Enum\ValidationRules\ValidationPacker;
use App\GraphQL\PipeBase;

final class PipeActionAppRedisUpdate extends PipeBase
{
    public string $storeValue = '';

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::ACTION_APP_REDIS_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->storeValue = $this->getArgAsString('store_value');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
        $packer    = new ValidationPacker();

        $packer->addValidation(
            'store_value',
            'Redis保存値',
            $this->storeValue,
            collect([
                EValidationType::REQUIRED->ruleSet(),
            ])
        );

        // バリデーションの実施.
        $validator = $packer->makeValidator();
        if ($validator->fails()) {
            $this->errors = $validator->errors();
        }
    }
}
