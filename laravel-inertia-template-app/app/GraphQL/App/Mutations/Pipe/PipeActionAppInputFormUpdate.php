<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\GraphQL\PipeBase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

final class PipeActionAppInputFormUpdate extends PipeBase
{
    public string $inputSingleNumber = '';

    public string $inputSingleNotZero = '';

    public string $inputMulti = '';

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
        $this->inputSingleNumber = $this->getArgAsString('input_single_number');
        $this->inputSingleNotZero = $this->getArgAsString('input_single_not_zero');
        $this->inputMulti = $this->getArgAsString('input_multi');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
        // データ.
        $data = [
            'input_single_number' => $this->inputSingleNumber,
            'input_single_not_zero' => $this->inputSingleNotZero,
            'input_multi' => $this->inputMulti,
        ];

        // ルール.
        $rules = [
            ...EValidationType::getRules(
                'input_single_number',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::NUMBER->pack(),
                ])
            ),
            ...EValidationType::getRules(
                'input_single_not_zero',
                collect([
                    EValidationType::REQUIRED_NOT_ZERO->pack(),
                ])
            ),
            ...EValidationType::getRules(
                'input_multi',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::LENGTH->pack(100),
                ])
            ),
        ];
        Log::info(print_r($rules, true));

        // エラー発生時のメッセージ.
        $messages = [
            ...EValidationType::getMessages(
                'input_single_number',
                'input(single:整数)',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::NUMBER->pack(),
                ])
            ),
            ...EValidationType::getMessages(
                'input_single_not_zero',
                'input(single:非0整数)',
                collect([
                    EValidationType::REQUIRED_NOT_ZERO->pack(),
                ])
            ),
            ...EValidationType::getMessages(
                'input_multi',
                'input(multi)',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::LENGTH->pack(100),
                ])
            ),
        ];

        // バリデーションの実施.
        $validator = Validator::make($data, $rules, $messages);

        if ($validator->fails()) {
            $this->errors = $validator->errors();
        }
    }
}
