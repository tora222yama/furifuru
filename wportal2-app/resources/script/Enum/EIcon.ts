/**
 * アイコン定義.
 */
export const E_ICON = {
  INVALID: 'invalid',

  ADD: 'add',
  ATTENDANCE: 'attendance',
  BUILD: 'build',
  CACHED: 'cached',
  CAFE: 'cafe',
  CLEAR: 'clear',
  DASHBOARD: 'dashboard',
  EXPAND_LESS: 'expand_less',
  EXPAND_MORE: 'expand_more',
  GOOGLE: 'google_icon.svg',
  HELP: 'help',
  HOME: 'home',
  OFFICE: 'office',
  REMOVE: 'remove',
  SHOP: 'shop',
  STAR: 'star',
  STAR_OUTLINE: 'star_outline',
} as const;
export type EIcon = (typeof E_ICON)[keyof typeof E_ICON];

/**
 * アイコンファイルのパス取得.
 * @param icon
 */
export const getIconPath = (icon: EIcon): string => {
  return `/image/icon/${icon}`;
};

/**
 * アイコンの基本widthを取得.
 * @param icon
 */
export const getIconWidth = (icon: EIcon): string => {
  switch (icon) {
    case E_ICON.ADD:
      return '20px';
    case E_ICON.ATTENDANCE:
      return '20px';
    case E_ICON.BUILD:
      return '20px';
    case E_ICON.CACHED:
      return '32px';
    case E_ICON.CAFE:
      return '20px';
    case E_ICON.CLEAR:
      return '20px';
    case E_ICON.DASHBOARD:
      return '20px';
    case E_ICON.EXPAND_LESS:
      return '20px';
    case E_ICON.EXPAND_MORE:
      return '20px';
    case E_ICON.GOOGLE:
      return '18px';
    case E_ICON.HELP:
      return '20px';
    case E_ICON.HOME:
      return '20px';
    case E_ICON.OFFICE:
      return '20px';
    case E_ICON.REMOVE:
      return '20px';
    case E_ICON.SHOP:
      return '20px';
    case E_ICON.STAR:
      return '20px';
    case E_ICON.STAR_OUTLINE:
      return '20px';
    default:
      return '0px';
  }
};

/**
 * アイコンの基本heightを取得.
 * @param icon
 */
export const getIconHeight = (icon: EIcon): string => {
  switch (icon) {
    case E_ICON.ADD:
      return '20px';
    case E_ICON.ATTENDANCE:
      return '20px';
    case E_ICON.BUILD:
      return '20px';
    case E_ICON.CACHED:
      return '32px';
    case E_ICON.CAFE:
      return '20px';
    case E_ICON.CLEAR:
      return '20px';
    case E_ICON.DASHBOARD:
      return '20px';
    case E_ICON.EXPAND_LESS:
      return '20px';
    case E_ICON.EXPAND_MORE:
      return '20px';
    case E_ICON.GOOGLE:
      return '18px';
    case E_ICON.HELP:
      return '20px';
    case E_ICON.HOME:
      return '20px';
    case E_ICON.OFFICE:
      return '20px';
    case E_ICON.REMOVE:
      return '20px';
    case E_ICON.SHOP:
      return '20px';
    case E_ICON.STAR:
      return '20px';
    case E_ICON.STAR_OUTLINE:
      return '20px';
    default:
      return '0px';
  }
};
