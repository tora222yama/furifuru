import * as React from 'react';
import { Button } from '@mui/material';
import { IPropsButton } from '@/js/Component/Button/IPropsButton';
import { TypoText } from '@/js/Component/Typography/TypoText';

/**
 * 一般的なボタン、paddingやmarginなど共通で編集できるようにするためのラッパー.
 */
interface IProps extends IPropsButton {}
export const ButtonGeneral: React.FC<IProps> = ({
  sx,
  id,
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

    return <TypoText>{label}</TypoText>;
  };

  return (
    <Button
      id={id}
      sx={{
        textTransform: 'none',
        padding: '10px 16px',
        ...sx,
      }}
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
