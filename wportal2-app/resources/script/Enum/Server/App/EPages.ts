import { E_ICON, EIcon } from '@/script/Enum/EIcon';

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
  ATTENDANCE_ROOT: 'attendance_root', // 勤怠確認.
  ATTENDANCE__EDIT: 'attendance__edit', // 勤怠修正.
  ATTENDANCE__TABLE: 'attendance__table', // 勤怠一覧表.
  PERSONAL_SETTING__SHOW: 'personal_setting__show', // 個人設定・閲覧.
  PERSONAL_SETTING__EDIT: 'personal_setting__edit', // 個人設定・編集.
  LOGIN: 'login', // ログイン.
  NOT_FOUND: 'not_found', // ページが見つからない.
} as const;
export type EPages = (typeof E_PAGES)[keyof typeof E_PAGES];
// #ENUM_DEFINE_END#

/**
 * メニュー設定.
 */
export interface IMenu {
  pages: EPages;
  parent: EPages;
  back: EPages;
  href: string;
  name: string;
  icon: EIcon;
}
const INVALID_MENU: IMenu = {
  pages: E_PAGES.INVALID,
  parent: E_PAGES.INVALID,
  back: E_PAGES.INVALID,
  href: '',
  name: '',
  icon: E_ICON.INVALID,
};

export const PagesList: IMenu[] = [
  INVALID_MENU,
  {
    pages: E_PAGES.DASHBOARD,
    parent: E_PAGES.INVALID,
    back: E_PAGES.INVALID,
    href: '/dashboard',
    name: 'ダッシュボード',
    icon: E_ICON.DASHBOARD,
  },
  {
    pages: E_PAGES.ATTENDANCE,
    parent: E_PAGES.INVALID,
    back: E_PAGES.INVALID,
    href: '/attendance',
    name: '勤怠共有',
    icon: E_ICON.ATTENDANCE,
  },
  {
    pages: E_PAGES.SHOP,
    parent: E_PAGES.INVALID,
    back: E_PAGES.INVALID,
    href: '/shop',
    name: 'ショップ',
    icon: E_ICON.SHOP,
  },
  {
    pages: E_PAGES.ATTENDANCE_ROOT,
    parent: E_PAGES.INVALID,
    back: E_PAGES.INVALID,
    href: '',
    name: '勤怠確認',
    icon: E_ICON.INVALID,
  },
  {
    pages: E_PAGES.ATTENDANCE__EDIT,
    parent: E_PAGES.ATTENDANCE_ROOT,
    back: E_PAGES.INVALID,
    href: '',
    name: '勤怠修正',
    icon: E_ICON.BUILD,
  },
  {
    pages: E_PAGES.ATTENDANCE__TABLE,
    parent: E_PAGES.ATTENDANCE_ROOT,
    back: E_PAGES.INVALID,
    href: '',
    name: '勤怠一覧表',
    icon: E_ICON.BUILD,
  },
];

/**
 * メニュー情報を取得.
 */
export const findPages = (pages: EPages): IMenu => {
  return PagesList.find(v => v.pages === pages) ?? INVALID_MENU;
};

/**
 * 各ページのURL.
 * @param page
 */
export const getPagesHref = (page: EPages): string => {
  return findPages(page).href;
};

/**
 * ページ名取得.
 * @param page
 */
export const getPagesName = (page: EPages): string => {
  return findPages(page).name;
};

/**
 * ページの戻り先を取得.
 * @param pages
 */
export const getPagesBack = (pages: EPages): EPages => {
  return findPages(pages).parent;
};
