import { E_COLOR, EColor } from '@/js/Enum/EColor';

/**
 * ボタン種別.
 */
export const E_BUTTON_TYPE = {
  INVALID: 0,
  PRIMARY: 1,
  SECONDARY: 2,
} as const;
export type EButtonType = (typeof E_BUTTON_TYPE)[keyof typeof E_BUTTON_TYPE];

/**
 * 通常カラーの取得.
 * @param type
 */
export const getButtonColorNormal = (type: EButtonType): EColor => {
  switch (type) {
    case E_BUTTON_TYPE.INVALID:
      return E_COLOR.WHITE;
    case E_BUTTON_TYPE.PRIMARY:
      return E_COLOR.PRIMARY_MAIN;
    case E_BUTTON_TYPE.SECONDARY:
      return E_COLOR.SECONDARY_MAIN;
    default:
      throw new Error();
  }
};

/**
 * Hoverカラーの取得.
 * @param type
 */
export const getButtonColorHover = (type: EButtonType): EColor => {
  switch (type) {
    case E_BUTTON_TYPE.INVALID:
      return E_COLOR.WHITE;
    case E_BUTTON_TYPE.PRIMARY:
      return E_COLOR.PRIMARY_DARK;
    case E_BUTTON_TYPE.SECONDARY:
      return E_COLOR.SECONDARY_DARK;
    default:
      throw new Error();
  }
};

/**
 * 非活性カラーの取得.
 * @param type
 */
export const getButtonColorDisabled = (type: EButtonType): EColor => {
  switch (type) {
    case E_BUTTON_TYPE.INVALID:
    case E_BUTTON_TYPE.PRIMARY:
    case E_BUTTON_TYPE.SECONDARY:
      return E_COLOR.GREY;
    default:
      throw new Error();
  }
};

/**
 * ラベルカラーの取得.
 * @param type
 */
export const getButtonColorText = (type: EButtonType): EColor => {
  switch (type) {
    case E_BUTTON_TYPE.INVALID:
      return E_COLOR.TEXT_PRIMARY;
    case E_BUTTON_TYPE.PRIMARY:
      return E_COLOR.WHITE;
    case E_BUTTON_TYPE.SECONDARY:
      return E_COLOR.TEXT_PRIMARY;
    default:
      throw new Error();
  }
};
