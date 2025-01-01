// #ENUM_DEFINE_START#
export const E_CALCULATE = {
  INVALID: 0, // 無効値.
  READY: 1, // 計算未処理.
  ESTABLISHED: 2, // 計算済・成立.
  DONE_WITHOUT_LUNCH: 3, // 計算済・不成立.
} as const;
export type ECalculate = (typeof E_CALCULATE)[keyof typeof E_CALCULATE];
// #ENUM_DEFINE_END#
