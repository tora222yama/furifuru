<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\GraphQL\PipeBase;
use Illuminate\Support\Facades\Validator;

final class PipeActionAppInputFormUpdate extends PipeBase
{
    public string $inputSingle = '';

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
        $this->inputSingle = $this->getArgAsString('input_single');
        $this->inputMulti = $this->getArgAsString('input_multi');
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
        // データ.
        $data = [
            'input_single' => $this->inputSingle,
            'input_multi' => $this->inputMulti,
        ];

        // ルール.
        $rules = [
            ...EValidationType::getRules(
                'input_single',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::NUMBER->pack(),
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

        // エラー発生時のメッセージ.
        $messages = [
            ...EValidationType::getMessages(
                'input_single',
                'input(single)',
                collect([
                    EValidationType::REQUIRED->pack(),
                    EValidationType::NUMBER->pack(),
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
