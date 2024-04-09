import * as React from 'react';
import { Button } from '@mui/material';
import { IPropsButton } from '@/script/Component/Button/IPropsButton';
import { TypoText } from '@/script/Component/Typography/TypoText';
import {
  E_BUTTON_TYPE,
  getButtonColorDisabled,
  getButtonColorHover,
  getButtonColorNormal,
  getButtonColorText,
} from '@/script/Component/Button/EButtonType';

/**
 * 一般的なボタン、paddingやmarginなど共通で編集できるようにするためのラッパー.
 */
interface IProps extends IPropsButton {}
export const ButtonGeneral: React.FC<IProps> = ({
  sx,
  id,
  buttonType = E_BUTTON_TYPE.PRIMARY,
  type,
  disabled,
  label,
  startIcon,
  endIcon,
  onClick,
  href,
  children,
}) => {
  /**
   * 表示ラベル.
   */
  const nodeLabel = (): React.ReactNode => {
    if (children) {
      return children;
    }

    return <TypoText color={getButtonColorText(buttonType)}>{label}</TypoText>;
  };

  return (
    <Button
      id={id}
      sx={{
        display: 'block',
        backgroundColor: getButtonColorNormal(buttonType),
        textTransform: 'none',
        padding: '10px 16px',
        ...sx,

        '&:hover': {
          backgroundColor: getButtonColorHover(buttonType),
        },
        '&:disabled': {
          backgroundColor: getButtonColorDisabled(buttonType),
        },
      }}
      type={type}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      href={href}
      variant="contained"
    >
      {nodeLabel()}
    </Button>
  );
};
