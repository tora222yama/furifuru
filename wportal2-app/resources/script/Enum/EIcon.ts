/**
 * アイコン定義.
 */
export const E_ICON = {
  INVALID: 'invalid',

  GOOGLE: 'google_icon.svg',
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
    case E_ICON.GOOGLE:
      return '18px';
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
    case E_ICON.GOOGLE:
      return '18px';
    default:
      return '0px';
  }
};
