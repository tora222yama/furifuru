/**
 * アイコン定義.
 */
export const E_ICON = {
  INVALID: 'invalid',

  ATTENDANCE: 'attendance',
  BUILD: 'build',
  DASHBOARD: 'dashboard',
  EXPAND_LESS: 'expand_less',
  EXPAND_MORE: 'expand_more',
  GOOGLE: 'google_icon.svg',
  HOME: 'home',
  OFFICE: 'office',
  SHOP: 'shop',
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
    case E_ICON.ATTENDANCE:
      return '20px';
    case E_ICON.BUILD:
      return '20px';
    case E_ICON.DASHBOARD:
      return '20px';
    case E_ICON.EXPAND_LESS:
      return '20px';
    case E_ICON.EXPAND_MORE:
      return '20px';
    case E_ICON.GOOGLE:
      return '18px';
    case E_ICON.HOME:
      return '20px';
    case E_ICON.OFFICE:
      return '20px';
    case E_ICON.SHOP:
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
    case E_ICON.ATTENDANCE:
      return '20px';
    case E_ICON.BUILD:
      return '20px';
    case E_ICON.DASHBOARD:
      return '20px';
    case E_ICON.EXPAND_LESS:
      return '20px';
    case E_ICON.EXPAND_MORE:
      return '20px';
    case E_ICON.GOOGLE:
      return '18px';
    case E_ICON.HOME:
      return '20px';
    case E_ICON.OFFICE:
      return '20px';
    case E_ICON.SHOP:
      return '20px';
    default:
      return '0px';
  }
};
