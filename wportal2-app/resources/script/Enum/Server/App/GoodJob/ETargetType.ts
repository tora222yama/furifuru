// #ENUM_DEFINE_START#
export const E_TARGET_TYPE = {
  INVALID: 0, // 無効値.
  USER: 1, // ユーザー.
  DIVISION: 2, // 部署.
  PROJECT: 3, // プロジェクト.
  LABEL: 4, // ラベル直指定.
} as const;
export type ETargetType = (typeof E_TARGET_TYPE)[keyof typeof E_TARGET_TYPE];
// #ENUM_DEFINE_END#
