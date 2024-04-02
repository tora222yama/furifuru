<?php

declare(strict_types=1);

namespace App\Enum\App;

use Illuminate\Support\Collection;

/**
 * バリデーション種別.
 * Class EValidationType
 */
enum EValidationType: string
{
    case INVALID = 'invalid'; // 未設定.
    case REQUIRED = 'required'; // 空白を許可しない.
    case NULLABLE = 'nullable'; // nullを許可する.
    case REQUIRED_NOT_ZERO = 'required_not_zero';   // 空白・0を許可しない.
    case NUMBER = 'number'; // 数値のみ.
    case NUMBER_HYPHEN = 'number_hyphen'; // 数値とハイフンのみ.
    case NUMBER_PLUS = 'number_plus'; // 0以上の数値のみ.
    case NUMBER_RANGE = 'number_range'; // min〜maxの範囲内のみ.
    case MAX_DIGIT = 'max_digit'; // max桁以下の整数のみ.
    case LENGTH = 'length'; // 文字数がmax以下.
    case INTEGER = 'integer'; // 整数のみ.
    case MAX = 'max'; // 数値の最大値.
    case JSON = 'json'; // json文字列のみ.
    case PHONE = 'phone'; // 電話番号.
    case EMAIL = 'email'; // Eメール.
    case ZIP_BEFORE = 'zip_before'; // 郵便番号 前半.
    case ZIP_AFTER = 'zip_after'; // 郵便番号 後半.
    case PERIOD = 'period'; // ピリオドの利用禁止.

    /**
     * バリデーションルールを取得.
     *
     * @param  Collection<EValidationType>  $rules
     */
    public static function getRules(
        string $columnTag,
        Collection $rules
    ): array {
        return [
            "$columnTag" => $rules->map(function (EValidationType $rule) {
                return $rule->getRule();
            })->toArray(),
        ];
    }

    /**
     * バリデーションメッセージを取得.
     *
     * @param  Collection<EValidationType>  $rules
     */
    public static function getMessages(
        string $columnTag,
        string $columnName,
        Collection $rules,
    ): array {
        return $rules->flatMap(function (EValidationType $rule) use ($columnTag, $columnName) {
            return ["$columnTag.".$rule->getRule() => $rule->getErrorMessage($columnName)];
        })->toArray();
    }

    /**
     * バリデーションルールを返す.
     */
    public function getRule(): string
    {
        return match ($this) {
            self::REQUIRED => 'required',
            self::NUMBER => 'numeric',
            default => '',
        };
    }

    /**
     * バリデーションメッセージを返す.
     */
    public function getErrorMessage(string $columnName): string
    {
        return match ($this) {
            self::REQUIRED => "${columnName}は必須項目です",
            self::NUMBER => "${columnName}が数値ではありません",
            default => '',
        };
    }
}
