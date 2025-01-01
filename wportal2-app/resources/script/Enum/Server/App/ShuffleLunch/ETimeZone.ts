// #ENUM_DEFINE_START#
export const E_TIME_ZONE = {
  INVALID: 0, // 無効値.
  STANDBY: 1, // 準備時間.
  ACTIVE: 2, // 実施時間.
} as const;
export type ETimeZone = (typeof E_TIME_ZONE)[keyof typeof E_TIME_ZONE];
// #ENUM_DEFINE_END#
