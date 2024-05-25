// #ENUM_DEFINE_START#
/**
 * 曜日の定義.
 */
export const E_WEEK_DAY = {
  SUNDAY: 0, // 日曜日.
  MONDAY: 1, // 月曜日.
  TUESDAY: 2, // 火曜日.
  WEDNESDAY: 3, // 水曜日.
  THURSDAY: 4, // 木曜日.
  FRIDAY: 5, // 金曜日.
  SATURDAY: 6, // 土曜日.
} as const;
export type EWeekDay = (typeof E_WEEK_DAY)[keyof typeof E_WEEK_DAY];
// #ENUM_DEFINE_END#
