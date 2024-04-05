<?php

declare(strict_types=1);

namespace App\Enum\App;

use App\Enum\ValidationRules\RuleMaxLength;
use App\Enum\ValidationRules\ValidationPack;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * バリデーション種別.
 * Class EValidationType
 */
enum EValidationType: string
{
    case INVALID           = 'invalid'; // 未設定.
    case REQUIRED          = 'required'; // 空白を許可しない.
    case REQUIRED_NOT_ZERO = 'required_not_zero';   // 空白・0を許可しない.
    case NUMBER            = 'number'; // 数値のみ.
    case NUMBER_HYPHEN     = 'number_hyphen'; // 数値とハイフンのみ.
    case NUMBER_PLUS       = 'number_plus'; // 0以上の数値のみ.
    case NUMBER_MAX        = 'max'; // 数値の最大値.
    case NUMBER_RANGE      = 'number_range'; // min〜maxの範囲内のみ.
    case MAX_DIGIT         = 'max_digit'; // max桁以下の整数のみ.
    case LENGTH            = 'length'; // 文字数がmax以下.
    case PHONE             = 'phone'; // 電話番号.
    case EMAIL             = 'email'; // Eメール.

    /**
     * バリデーション指定の情報を作成.
     */
    public function pack(int $value1 = 0, int $value2 = 0): ValidationPack
    {
        return new ValidationPack($this, $value1, $value2);
    }

    /**
     * 自作バリデーションルールかどうか.
     */
    public function isCustomRule(): bool
    {
        return match ($this) {
            self::LENGTH => true,
            default      => false,
        };
    }

    /**
     * バリデーションルールを取得.
     *
     * @param  Collection<ValidationPack>  $rules
     */
    public static function getRules(
        string $columnTag,
        Collection $rules
    ): array {
        return [
            "$columnTag" => $rules->flatMap(function (ValidationPack $pack) {
                return $pack->rule();
            })->toArray(),
        ];
    }

    /**
     * バリデーションメッセージを取得.
     *
     * @param  Collection<ValidationPack>  $rules
     */
    public static function getMessages(
        string $columnTag,
        string $columnName,
        Collection $rules,
    ): array {
        return $rules->flatMap(function (ValidationPack $pack) use ($columnTag, $columnName) {
            // カスタムルールはメッセージ設定が不要.
            if ($pack->type->isCustomRule()) {
                return true;
            }

            // ルール内の各指定について処理する.
            return $pack->rule()->flatMap(function (ValidationRule|string $rule) use (
                $columnTag,
                $pack,
                $columnName
            ) {
                // 設定値付きのタグから設定値を除外.
                $tag = $rule;
                if (Str::contains($tag, ':')) {
                    $tag = Str::substr($rule, 0, Str::position($rule, ':'));
                }

                // タグを設定、required|not_inの場合は
                // column.requiredとcolumn.not_inの両方を設定しておく必要がある.
                return ["$columnTag.".$tag => $pack->message($columnName)];
            });
        })->toArray();
    }

    /**
     * バリデーションルールを返す.
     */
    public function getRule(ValidationPack $pack): Collection
    {
        $value1 = $pack->value1;
        $value2 = $pack->value2;

        return match ($this) {
            self::REQUIRED          => collect(['required']),
            self::REQUIRED_NOT_ZERO => collect(['required', 'not_in:0']),
            self::NUMBER            => collect(['numeric']),
            self::NUMBER_HYPHEN     => collect(['regex:/^[0-9-]+$/']),
            self::NUMBER_PLUS       => collect(['numeric', 'gte:0']),
            self::NUMBER_MAX        => collect(['numeric', "max:$value1"]),
            self::NUMBER_RANGE      => collect(['numeric', "gte:$value1", "lte:$value2"]),
            self::MAX_DIGIT         => collect(["max_digits:$value1"]),
            self::LENGTH            => collect([new RuleMaxLength($value1)]),
            self::PHONE             => collect(['regex:/^[0-9-]{10,13}$/']),
            self::EMAIL             => collect(["regex:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-z]{2,13}$/"]),
            default                 => collect(),
        };
    }

    /**
     * バリデーションメッセージを返す.
     */
    public function getErrorMessage(string $columnName, ValidationPack $pack): string
    {
        // カスタムルールはメッセージ設定が不要.
        if ($this->isCustomRule()) {
            return '';
        }

        $value1 = $pack->value1;
        $value2 = $pack->value2;

        return match ($this) {
            self::REQUIRED,
            self::REQUIRED_NOT_ZERO => "${columnName}は必須項目です",
            self::NUMBER            => "${columnName}が数値ではありません",
            self::NUMBER_HYPHEN     => "${columnName}は数値とハイフンのみで入力してください",
            self::NUMBER_PLUS       => "${columnName}が正の数値ではありません",
            self::NUMBER_MAX        => "${columnName}は${value1}以下の整数で入力してください",
            self::NUMBER_RANGE      => "${columnName}は[$value1-$value2]の範囲で入力してください",
            self::MAX_DIGIT         => "${columnName}は${value1}桁以下の整数で入力してください",
            // self::LENGTH => '', カスタムルール.
            self::PHONE             => "${columnName}は10〜13字の半角数字及び\"-\"で入力してください",
            self::EMAIL             => "${columnName}はメールアドレス形式で入力してください",
            default                 => '',
        };
    }
}
