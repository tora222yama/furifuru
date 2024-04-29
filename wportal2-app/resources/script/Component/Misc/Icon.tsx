import * as React from 'react';
import { styled } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import {
  E_ICON,
  EIcon,
  getIconHeight,
  getIconPath,
  getIconWidth,
} from '@/script/Enum/EIcon';

const StyledImg = styled('img')({});

interface IProps extends IPropsBase {
  icon: EIcon;
  size?: string;
  width?: string;
  height?: string;
}
export const Icon: React.FC<IProps> = ({ sx, icon, size, width, height }) => {
  // 指定がない場合は対応なし.
  if (icon === E_ICON.INVALID) {
    return null;
  }

  // size指定があれば正方利用、いずれの指定もなければデフォルト値を利用.
  const iconWidth = (size || width) ?? getIconWidth(icon);
  const iconHeight = (size || height) ?? getIconHeight(icon);

  return (
    <StyledImg
      sx={{
        width: iconWidth,
        height: iconHeight,
        ...sx,
      }}
      src={getIconPath(icon)}
    />
  );
};
