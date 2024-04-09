<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\Enum\ValidationRules\ValidationPacker;
use App\GraphQL\PipeBase;

final class PipeActionAppInputFormUpdate extends PipeBase
{
    public string $inputSingleNumber  = '';

    public string $inputSingleNotZero = '';

    public string $inputSingleRange   = '';

    public string $inputSingleEmail   = '';

    public string $inputMulti         = '';

    /**
     * PipeActionAppInputFormUpdate constructor.
     */
    public function __construct(array $args)
    {
        parent::__construct(EPipeKind::ACTION_APP_INPUT_FORM_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->inputSingleNumber  = $this->getArgAsString('input_single_number');
        $this->inputSingleNotZero = $this->getArgAsString('input_single_not_zero');
        $this->inputSingleRange   = $this->getArgAsString('input_single_range');
        $this->inputSingleEmail   = $this->getArgAsString('input_single_email');
        $this->inputMulti         = $this->getArgAsString('input_multi');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
        $packer    = new ValidationPacker();

        // Input(single).
        $packer->addValidation(
            'input_single_number',
            'input(single:整数)',
            $this->inputSingleNumber,
            collect([
                EValidationType::REQUIRED->ruleSet(),
                EValidationType::NUMBER->ruleSet(),
            ])
        );
        $packer->addValidation(
            'input_single_not_zero',
            'input(single:非0)',
            $this->inputSingleNotZero,
            collect([
                EValidationType::REQUIRED_NOT_ZERO->ruleSet(),
            ])
        );
        $packer->addValidation(
            'input_single_range',
            'input(single:範囲)',
            $this->inputSingleRange,
            collect([
                EValidationType::NUMBER_RANGE->ruleSet(20, 50),
            ])
        );
        $packer->addValidation(
            'input_single_email',
            'input(email)',
            $this->inputSingleEmail,
            collect([
                EValidationType::EMAIL->ruleSet(),
            ])
        );

        // Input(multi)
        $packer->addValidation(
            'input_multi',
            'input(multi)',
            $this->inputMulti,
            collect([
                EValidationType::REQUIRED->ruleSet(),
                EValidationType::LENGTH->ruleSet(100),
            ]),
        );

        // バリデーションの実施.
        $validator = $packer->makeValidator();
        if ($validator->fails()) {
            $this->errors = $validator->errors();
        }
    }
}
