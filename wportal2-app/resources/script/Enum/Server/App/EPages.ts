// #ENUM_DEFINE_START#
/**
 * ページ種別.
 * routingと1vs1対応
 */
export const E_PAGES = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  ATTENDANCE: 'attendance', // 勤怠共有.
  ATTENDANCE_CREATE: 'attendance_create', // 勤怠共有・追加.
  ATTENDANCE_DELETE: 'attendance_delete', // 勤怠共有・削除.
  ATTENDANCE_DIVISION_PRIORITY: 'attendance_division_priority', // 課優先度変更.
  ATTENDANCE_PROJECT_PRIORITY: 'attendance_project_priority', // プロジェクト優先度変更.
  SHOP: 'shop', // ショップ.
  ATTENDANCE__EDIT: 'attendance__edit', // 勤怠修正.
  ATTENDANCE__TABLE: 'attendance__table', // 勤怠一覧表.
  DIVISION: 'division', // 課一覧.
  DIVISION__SHOW: 'division__show', // 課詳細.
  DIVISION__EDIT: 'division__edit', // 課編集.
  DIVISION__UPDATE: 'division__update', // 課更新.
  DIVISION__UPDATE_USER: 'division__update_user', // 課メンバー更新.
  PROJECT: 'project', // プロジェクト一覧.
  PROJECT__SHOW: 'project__show', // プロジェクト詳細.
  PROJECT__EDIT: 'project__edit', // プロジェクト編集.
  PROJECT__UPDATE: 'project__update', // プロジェクト更新.
  PROJECT__UPDATE_USER: 'project__update_user', // プロジェクトメンバー更新.
  PROJECT__DELETE: 'project__delete', // プロジェクト編集.
  USER: 'user', // メンバー一覧.
  USER__SHOW: 'user__show', // メンバー詳細.
  USER__EDIT: 'user__edit', // メンバー編集.
  PERSONAL_SETTING__SHOW: 'personal_setting__show', // 個人設定・閲覧.
  PERSONAL_SETTING__EDIT: 'personal_setting__edit', // 個人設定・編集.
  PERSONAL_SETTING__UPDATE: 'personal_setting__update', // 個人設定・更新.
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
    case E_PAGES.ATTENDANCE:
      return '/attendance';
    case E_PAGES.ATTENDANCE_CREATE:
      return '/attendance/create';
    case E_PAGES.ATTENDANCE_DELETE:
      return '/attendance/delete';
    case E_PAGES.ATTENDANCE_DIVISION_PRIORITY:
      return '/attendance/division_priority';
    case E_PAGES.ATTENDANCE_PROJECT_PRIORITY:
      return '/attendance/project_priority';
    case E_PAGES.DIVISION:
      return '/division';
    case E_PAGES.DIVISION__SHOW:
      return `/division/$divisionId/show`;
    case E_PAGES.DIVISION__EDIT:
      return `/division/$divisionId/edit`;
    case E_PAGES.DIVISION__UPDATE:
      return '/division/update';
    case E_PAGES.DIVISION__UPDATE_USER:
      return '/division/update_user';
    case E_PAGES.PROJECT:
      return '/project';
    case E_PAGES.PROJECT__SHOW:
      return '/project/$projectId/show';
    case E_PAGES.PROJECT__EDIT:
      return '/project/$projectId/edit';
    case E_PAGES.PROJECT__UPDATE:
      return '/project/update';
    case E_PAGES.PROJECT__UPDATE_USER:
      return '/project/update_user';
    case E_PAGES.PROJECT__DELETE:
      return '/project/delete';
    case E_PAGES.USER:
      return '/user';
    case E_PAGES.USER__SHOW:
      return '/user/$userId/show';
    case E_PAGES.USER__EDIT:
      return '/user/$userId/edit';
    case E_PAGES.PERSONAL_SETTING__SHOW:
      return '/personal_setting/show';
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return '/personal_setting/edit';
    case E_PAGES.PERSONAL_SETTING__UPDATE:
      return '/personal_setting/update';
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
    case E_PAGES.ATTENDANCE:
      return '勤怠共有';
    case E_PAGES.DIVISION:
      return '課一覧';
    case E_PAGES.DIVISION__SHOW:
      return '課詳細';
    case E_PAGES.DIVISION__EDIT:
      return '課編集';
    case E_PAGES.PROJECT:
      return 'プロジェクト一覧';
    case E_PAGES.PROJECT__SHOW:
      return 'プロジェクト詳細';
    case E_PAGES.PROJECT__EDIT:
      return 'プロジェクト編集';
    case E_PAGES.USER:
      return 'メンバー一覧';
    case E_PAGES.USER__SHOW:
      return 'メンバー詳細';
    case E_PAGES.USER__EDIT:
      return 'メンバー編集';
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
    case E_PAGES.PROJECT__SHOW:
      return [E_PAGES.PROJECT];
    case E_PAGES.PROJECT__EDIT:
      return [E_PAGES.PROJECT, E_PAGES.PROJECT__SHOW];
    case E_PAGES.USER__SHOW:
      return [E_PAGES.USER];
    case E_PAGES.USER__EDIT:
      return [E_PAGES.USER, E_PAGES.USER__SHOW];
    case E_PAGES.PERSONAL_SETTING__EDIT:
      return [E_PAGES.PERSONAL_SETTING__SHOW];
    default:
      return [E_PAGES.DASHBOARD];
  }
};
