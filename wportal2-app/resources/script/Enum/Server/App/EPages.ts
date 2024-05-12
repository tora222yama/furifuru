// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  ATTENDANCE: 'attendance', // 勤怠共有.
  SHOP: 'shop', // ショップ.
  ATTENDANCE__EDIT: 'attendance__edit', // 勤怠修正.
  ATTENDANCE__TABLE: 'attendance__table', // 勤怠一覧表.
  DIVISION: 'division', // 課一覧.
  DIVISION__SHOW: 'division__show', // 課詳細.
  DIVISION__EDIT: 'division__edit', // 課編集.
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
 * @param val1
 */
export interface IPagesHrefReplace {
  target: string;
  value: string;
}
const getHref = (page: EPages): string => {
  switch (page) {
    case E_PAGES.DASHBOARD:
      return '/dashboard';
    case E_PAGES.DIVISION:
      return '/division';
    case E_PAGES.DIVISION__SHOW:
      return `/division/$divisionId/show`;
    case E_PAGES.DIVISION__EDIT:
      return `/division/$divisionId/edit`;
    case E_PAGES.PERSONAL_SETTING__SHOW:
      return '/personal_setting/show';
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return '/personal_setting/edit';
    default:
      return '/';
  }
};
export const getPagesHref = (
  page: EPages,
  replace: IPagesHrefReplace[] = [],
): string => {
  let href = getHref(page);
  replace.forEach(v => {
    href = href.replace(v.target, v.value);
  });
  return href;
};

/**
 * ページ名取得.
 * @param page
 */
export const getPagesName = (page: EPages): string => {
  switch (page) {
    case E_PAGES.DASHBOARD:
      return 'ダッシュボード';
    case E_PAGES.DIVISION:
      return '課一覧';
    case E_PAGES.DIVISION__SHOW:
      return '課詳細';
    case E_PAGES.DIVISION__EDIT:
      return '課編集';
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
export const getPagesBack = (pages: EPages): EPages[] => {
  switch (pages) {
    case E_PAGES.DIVISION__SHOW:
      return [E_PAGES.DIVISION];
    case E_PAGES.DIVISION__EDIT:
      return [E_PAGES.DIVISION, E_PAGES.DIVISION__SHOW];
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return [E_PAGES.PERSONAL_SETTING__SHOW];
    default:
      return [E_PAGES.DASHBOARD];
  }
};
