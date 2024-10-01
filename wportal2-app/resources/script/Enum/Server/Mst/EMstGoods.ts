// #ENUM_DEFINE_START#
/**
 * 商品の種別.
 */
export const E_MST_GOODS = {
  INVALID: 0, // 指定なし.
  LUNCH_TICKET_TOBARU_LOW: 1, // ランチチケット・桃原LOW.
  LUNCH_TICKET_TOBARU_MIDDLE: 2, // ランチチケット・桃原MIDDLE.
  LUNCH_TICKET_TOBARU_HIGH: 3, // ランチチケット・桃原HIGH.
} as const;
export type EMstGoods = (typeof E_MST_GOODS)[keyof typeof E_MST_GOODS];
// #ENUM_DEFINE_END#
