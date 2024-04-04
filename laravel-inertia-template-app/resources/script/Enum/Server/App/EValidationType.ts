// #ENUM_DEFINE_START#
/**
 * バリデーション種別.
 * Class EValidationType
 */
export const E_VALIDATION_TYPE = {
  INVALID: 'invalid', // 未設定.
  REQUIRED: 'required', // 空白を許可しない.
  NULLABLE: 'nullable', // nullを許可する.
  REQUIRED_NOT_ZERO: 'required_not_zero', // 空白・0を許可しない.
  NUMBER: 'number', // 数値のみ.
  NUMBER_HYPHEN: 'number_hyphen', // 数値とハイフンのみ.
  NUMBER_PLUS: 'number_plus', // 0以上の数値のみ.
  NUMBER_RANGE: 'number_range', // min〜maxの範囲内のみ.
  MAX_DIGIT: 'max_digit', // max桁以下の整数のみ.
  LENGTH: 'length', // 文字数がmax以下.
  INTEGER: 'integer', // 整数のみ.
  MAX: 'max', // 数値の最大値.
  JSON: 'json', // json文字列のみ.
  PHONE: 'phone', // 電話番号.
  EMAIL: 'email', // Eメール.
  ZIP_BEFORE: 'zip_before', // 郵便番号 前半.
  ZIP_AFTER: 'zip_after', // 郵便番号 後半.
  PERIOD: 'period', // ピリオドの利用禁止.
} as const;
export type EValidationType =
  (typeof E_VALIDATION_TYPE)[keyof typeof E_VALIDATION_TYPE];
// #ENUM_DEFINE_END#
