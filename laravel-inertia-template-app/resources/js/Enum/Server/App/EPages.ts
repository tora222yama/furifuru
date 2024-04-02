// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  MVC_VALUE: 'mvc_value', // MVC値渡し.
  REDIS: 'redis', // Redis操作.
  SLACK_LOG: 'slack_log', // Slackログ通知.
  HEALTH_CHECK: 'health_check', // ヘルスチェック.
} as const;
export type EPages = (typeof E_PAGES)[keyof typeof E_PAGES];
// #ENUM_DEFINE_END#
