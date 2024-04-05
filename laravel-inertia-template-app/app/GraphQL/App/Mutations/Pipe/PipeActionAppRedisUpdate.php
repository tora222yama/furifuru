<?php

declare(strict_types=1);

namespace App\GraphQL\App\Mutations\Pipe;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\GraphQL\PipeBase;
use Illuminate\Support\Facades\Validator;

final class PipeActionAppRedisUpdate extends PipeBase
{
    public string $storeValue = '';

    /**
     * PipeActionAppRedisUpdate constructor.
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
        // データ.
        $data      = [
            'store_value' => $this->storeValue,
        ];

        // ルール.
        $rules     = [
            ...EValidationType::getRules(
                'store_value',
                collect([
                    EValidationType::REQUIRED->pack(),
                ])
            ),
        ];

        // エラー発生時のメッセージ.
        $messages  = [
            ...EValidationType::getMessages(
                'store_value',
                'Redis保存値',
                collect([
                    EValidationType::REQUIRED->pack(),
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
