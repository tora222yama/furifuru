import { themeCommon } from '@/script/System/Theme';

/**
 * フォントサイズ・レスポンシブ調整:h1
 */
themeCommon.typography.h1 = {
  ...themeCommon.typography.h1,
  fontSize: '28px',
  [themeCommon.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
};

/**
 * フォントサイズ・レスポンシブ調整:body1
 */
themeCommon.typography.body1 = {
  ...themeCommon.typography.body1,
  fontSize: '16px',
  [themeCommon.breakpoints.down('sm')]: {
    fontSize: '10px',
  },
};

/**
 * フォントサイズ・レスポンシブ調整:button
 */
themeCommon.typography.button = {
  ...themeCommon.typography.button,
  fontSize: '16px',
  [themeCommon.breakpoints.down('sm')]: {
    fontSize: '10px',
  },
};

/**
 * レスポンシブ用spacing設定.
 * @param unit
 */
export const responsiveSpacing = (unit: number) => {
  return {
    xs: unit / 2,
    sm: unit,
  };
};

/**
 * レスポンシブ用size設定.
 * @param unit
 */
export const responsiveSize = (unit: number) => {
  return {
    xs: themeCommon.spacing(unit / 2),
    sm: themeCommon.spacing(unit),
  };
};
