import { E_ICON, EIcon } from '@/script/Enum/EIcon';
import { E_PAGES, EPages } from '@/script/Enum/Server/App/EPages';
import { AppTrnUserAuthorityList } from '@/script/Models/App/Trn/TrnUserAuthorityList';
import { E_USER_AUTHORITY } from '@/script/Enum/Server/App/EUserAuthority';

export const E_MENU = {
  INVALID: 'invalid', // 無効.
  DASHBOARD: 'dashboard', // ダッシュボード.
  ATTENDANCE: 'attendance', // 勤怠共有.
  SHOP: 'shop', // ショップ.
  ATTENDANCE_ROOT: 'attendance_root', // 勤怠確認.
  ATTENDANCE_EDIT: 'attendance_edit', // 勤怠修正.
  ATTENDANCE_TABLE: 'attendance_table', // 勤怠一覧表.
  DIVISION_ROOT: 'division_root', // 課.
  DIVISION: 'division', // 課一覧.
  PROJECT_ROOT: 'project_root', // プロジェクト.
  PROJECT: 'project', // プロジェクト一覧.
  USER_ROOT: 'user_root', // メンバー.
  USER: 'user', // メンバー一覧.
  ADMIN_ROOT: 'admin_root', // 管理.
  ADMIN_DATA: 'admin_data', // データ.
  ADMIN_COMMAND: 'admin_command', // コマンド.
} as const;
export type EMenu = (typeof E_MENU)[keyof typeof E_MENU];

/**
 * メニュー設定.
 */
export interface IMenu {
  menu: EMenu;
  pages: EPages;
  parent: EMenu;
  back: EPages;
  name: string;
  icon: EIcon;
}

export const MenuList: IMenu[] = [
  {
    menu: E_MENU.DASHBOARD,
    pages: E_PAGES.DASHBOARD,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: 'ダッシュボード',
    icon: E_ICON.DASHBOARD,
  },
  {
    menu: E_MENU.ATTENDANCE,
    pages: E_PAGES.ATTENDANCE,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: '勤怠共有',
    icon: E_ICON.ATTENDANCE,
  },
  {
    menu: E_MENU.SHOP,
    pages: E_PAGES.SHOP,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: 'ショップ',
    icon: E_ICON.SHOP,
  },
  {
    menu: E_MENU.ATTENDANCE_ROOT,
    pages: E_PAGES.INVALID,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: '勤怠確認',
    icon: E_ICON.INVALID,
  },
  {
    menu: E_MENU.ATTENDANCE_EDIT,
    pages: E_PAGES.ATTENDANCE__EDIT,
    parent: E_MENU.ATTENDANCE_ROOT,
    back: E_PAGES.INVALID,
    name: '勤怠修正',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.ATTENDANCE_TABLE,
    pages: E_PAGES.ATTENDANCE__TABLE,
    parent: E_MENU.ATTENDANCE_ROOT,
    back: E_PAGES.INVALID,
    name: '勤怠一覧表',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.DIVISION_ROOT,
    pages: E_PAGES.DASHBOARD,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: '課',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.DIVISION,
    pages: E_PAGES.DIVISION,
    parent: E_MENU.DIVISION_ROOT,
    back: E_PAGES.INVALID,
    name: '課一覧',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.PROJECT_ROOT,
    pages: E_PAGES.DASHBOARD,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: 'プロジェクト',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.PROJECT,
    pages: E_PAGES.PROJECT,
    parent: E_MENU.PROJECT_ROOT,
    back: E_PAGES.INVALID,
    name: 'プロジェクト一覧',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.USER_ROOT,
    pages: E_PAGES.INVALID,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: 'メンバー',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.USER,
    pages: E_PAGES.USER,
    parent: E_MENU.USER_ROOT,
    back: E_PAGES.INVALID,
    name: 'メンバー一覧',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.ADMIN_ROOT,
    pages: E_PAGES.DASHBOARD,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: '管理',
    icon: E_ICON.BUILD,
  },
  {
    menu: E_MENU.ADMIN_DATA,
    pages: E_PAGES.DASHBOARD,
    parent: E_MENU.ADMIN_ROOT,
    back: E_PAGES.INVALID,
    name: 'データ',
    icon: E_ICON.BUILD,
  },
];

/**
 * 対象のメニューが表示対象かどうか.
 */
export const isActiveMenu = (
  menu: EMenu,
  authorityList: AppTrnUserAuthorityList,
): boolean => {
  switch (menu) {
    case E_MENU.ADMIN_ROOT:
    case E_MENU.ADMIN_COMMAND:
    case E_MENU.ADMIN_DATA:
      return authorityList.hasAuthority([
        E_USER_AUTHORITY.ADMIN_PRIVILEGE,
        E_USER_AUTHORITY.ADMIN_COMMAND,
      ]);
    default:
      return true;
  }
};

/**
 * メニュー情報を取得.
 */
export const findMenu = (menu: EMenu): IMenu | undefined => {
  return MenuList?.find(v => v.menu === menu);
};

/**
 * 子メニューがあるかどうか.
 */
export const hasChildMenu = (menu: EMenu): boolean => {
  return !!MenuList.find(v => v.parent === menu);
};
