// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  PERSONAL_SETTING__SHOW: 'personal_setting__show', // 個人設定・閲覧.
  LOGIN: 'login', // ログイン.
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
    case E_PAGES.PERSONAL_SETTING__SHOW:
      return '/personal_setting/show';
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
    case E_PAGES.PERSONAL_SETTING__SHOW:
      return '個人設定';
    default:
      return '';
  }
};
