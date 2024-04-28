// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  MVC_VALUE: 'mvc_value', // MVC値渡し.
  INPUT_FORM: 'input_form', // 入力フォーム.
  REDIS: 'redis', // Redis操作.
  REDIS_POST_RESULT: 'redis_post_result', // RedisをPostで更新.
  SLACK_LOG: 'slack_log', // Slackログ通知.
  LOGIN_FORM: 'login', // ログインフォーム.
  PAGINATION: 'pagination', // ページネーション.
  HEALTH_CHECK: 'health_check', // ヘルスチェック.
  NOT_FOUND: 'not_found', // ページが見つからない.
} as const;
export type EPages = (typeof E_PAGES)[keyof typeof E_PAGES];
// #ENUM_DEFINE_END#

/**
 * 各ページのURL.
 * @param page
 */
export const getPagesHref = (page: EPages): string => {
  switch (page) {
    case E_PAGES.DASHBOARD:
      return '/dashboard';
    case E_PAGES.MVC_VALUE:
      return '/mvc_value';
    case E_PAGES.INPUT_FORM:
      return '/input_form';
    case E_PAGES.REDIS:
      return '/redis';
    case E_PAGES.REDIS_POST_RESULT:
      return '/redis_post_result';
    case E_PAGES.SLACK_LOG:
      return '/slack_log';
    case E_PAGES.LOGIN_FORM:
      return '/login_form';
    case E_PAGES.PAGINATION:
      return '/pagination';
    default:
      return '';
  }
};

/**
 * ページ名取得.
 * @param page
 */
export const getPagesName = (page: EPages): string => {
  switch (page) {
    case E_PAGES.DASHBOARD:
      return 'ダッシュボード';
    case E_PAGES.MVC_VALUE:
      return 'MVC値渡し';
    case E_PAGES.INPUT_FORM:
      return '入力フォーム';
    case E_PAGES.REDIS:
      return 'Redis/GraphQL';
    case E_PAGES.REDIS_POST_RESULT:
      return 'Redis - Postによる更新結果';
    case E_PAGES.SLACK_LOG:
      return 'Slack通知・Log出力';
    case E_PAGES.LOGIN_FORM:
      return 'ログインフォーム';
    case E_PAGES.PAGINATION:
      return 'ページネーション';
    default:
      return '';
  }
};
