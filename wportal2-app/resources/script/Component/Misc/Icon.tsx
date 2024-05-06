import * as React from 'react';
import { styled } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {
  E_ICON,
  EIcon,
  getIconHeight,
  getIconPath,
  getIconWidth,
} from '@/script/Enum/EIcon';
import { IPropsBase } from '@/script/System/System';

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

  const iconSx = {
    width: iconWidth,
    height: iconHeight,
    ...sx,
  };

  // 組み込みアイコンの場合.
  switch (icon) {
    case E_ICON.ATTENDANCE:
      return <AccessTimeIcon sx={iconSx} />;
    case E_ICON.BUILD:
      return <BuildIcon sx={iconSx} />;
    case E_ICON.DASHBOARD:
      return <DashboardIcon sx={iconSx} />;
    case E_ICON.EXPAND_LESS:
      return <ExpandLess sx={iconSx} />;
    case E_ICON.EXPAND_MORE:
      return <ExpandMore sx={iconSx} />;
    case E_ICON.SHOP:
      return <ShoppingBasketIcon sx={iconSx} />;
    default:
      break;
  }

  return <StyledImg sx={iconSx} src={getIconPath(icon)} />;
};
