// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  PERSONAL_SETTING__SHOW: 'personal_setting__show', // 個人設定・閲覧.
  PERSONAL_SETTING__EDIT: 'personal_setting__edit', // 個人設定・編集.
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
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return '/personal_setting/edit';
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
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return '個人設定編集';
    default:
      return '';
  }
};

/**
 * ページの戻り先を取得.
 * @param pages
 */
export const getPagesBack = (pages: EPages): EPages => {
  switch (pages) {
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return E_PAGES.PERSONAL_SETTING__SHOW;
    default:
      return E_PAGES.DASHBOARD;
  }
};
