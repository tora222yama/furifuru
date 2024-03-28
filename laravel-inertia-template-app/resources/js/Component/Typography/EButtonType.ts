import { match } from 'ts-pattern';
import { E_COLOR, EColor } from '@/js/Component/Enum/EColor';

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
  return <EColor>match(type)
    .with(E_BUTTON_TYPE.INVALID, () => E_COLOR.WHITE)
    .with(E_BUTTON_TYPE.PRIMARY as never, () => E_COLOR.PRIMARY_MAIN)
    .with(E_BUTTON_TYPE.SECONDARY as never, () => E_COLOR.SECONDARY_MAIN)
    .otherwise(() => {
      throw new Error();
    });
};

/**
 * Hoverカラーの取得.
 * @param type
 */
export const getButtonColorHover = (type: EButtonType): EColor => {
  return <EColor>match(type)
    .with(E_BUTTON_TYPE.INVALID, () => E_COLOR.WHITE)
    .with(E_BUTTON_TYPE.PRIMARY as never, () => E_COLOR.PRIMARY_DARK)
    .with(E_BUTTON_TYPE.SECONDARY as never, () => E_COLOR.SECONDARY_DARK)
    .otherwise(() => {
      throw new Error();
    });
};

/**
 * 非活性カラーの取得.
 * @param type
 */
export const getButtonColorDisabled = (type: EButtonType): EColor => {
  return <EColor>match(type)
    .with(E_BUTTON_TYPE.INVALID, () => E_COLOR.GREY)
    .with(E_BUTTON_TYPE.PRIMARY as never, () => E_COLOR.GREY)
    .with(E_BUTTON_TYPE.SECONDARY as never, () => E_COLOR.GREY)
    .otherwise(() => {
      throw new Error();
    });
};

/**
 * ラベルカラーの取得.
 * @param type
 */
export const getButtonColorText = (type: EButtonType): EColor => {
  return <EColor>match(type)
    .with(E_BUTTON_TYPE.INVALID, () => E_COLOR.TEXT_PRIMARY)
    .with(E_BUTTON_TYPE.PRIMARY as never, () => E_COLOR.WHITE)
    .with(E_BUTTON_TYPE.SECONDARY as never, () => E_COLOR.TEXT_PRIMARY)
    .otherwise(() => {
      throw new Error();
    });
};
