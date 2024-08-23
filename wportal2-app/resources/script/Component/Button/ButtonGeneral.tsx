import * as React from 'react';
import { Button } from '@mui/material';
import { IPropsButton } from '@/script/Component/Button/IPropsButton';
import {
  E_BUTTON_TYPE,
  getButtonColorDisabled,
  getButtonColorHover,
  getButtonColorNormal,
  getButtonColorText,
  getButtonVariant,
} from '@/script/Component/Button/EButtonType';

/**
 * 一般的なボタン、paddingやmarginなど共通で編集できるようにするためのラッパー.
 */
interface IProps extends IPropsButton {}
export const ButtonGeneral: React.FC<IProps> = ({
  sx,
  id,
  className,
  buttonType = E_BUTTON_TYPE.CONTAINED_PRIMARY,
  type,
  disabled,
  label,
  startIcon,
  endIcon,
  onClick,
  href,
  children,
}) => {
  return (
    <Button
      id={id}
      className={className}
      sx={{
        backgroundColor: getButtonColorNormal(buttonType),
        color: getButtonColorText(buttonType),
        textTransform: 'none',
        padding: '10px 16px',
        overflow: 'hidden',

        '&:hover': {
          backgroundColor: getButtonColorHover(buttonType),
        },
        '&:disabled': {
          backgroundColor: getButtonColorDisabled(buttonType),
        },

        ...sx,
      }}
      type={type}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      href={href}
      variant={getButtonVariant(buttonType)}
    >
      {children ?? label}
    </Button>
  );
};
