import * as React from 'react';
import { styled } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import CachedIcon from '@mui/icons-material/Cached';
import CircleIcon from '@mui/icons-material/Circle';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import MenuIcon from '@mui/icons-material/Menu';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { ArrowBackIos } from '@mui/icons-material';
import { E_ICON, EIcon, getIconPath, getIconSize } from '@/script/Enum/EIcon';
import { IPropsBase } from '@/script/System/System';
import { responsiveSize } from '@/script/System/Responsive';

const StyledImg = styled('img')({});

interface IProps extends IPropsBase {
  icon: EIcon;
  size?: number;
  width?: number;
  height?: number;
  onClick?: () => void;
}
export const Icon: React.FC<IProps> = ({
  sx,
  icon,
  size,
  width,
  height,
  onClick,
}) => {
  // 指定がない場合は対応なし.
  if (icon === E_ICON.INVALID) {
    return null;
  }

  // size指定があれば正方利用、いずれの指定もなければデフォルト値を利用.
  const iconWidth = (size || width) ?? getIconSize(icon).w;
  const iconHeight = (size || height) ?? getIconSize(icon).h;
  const iconSx = {
    width: responsiveSize(iconWidth),
    height: responsiveSize(iconHeight),
    ...sx,
  };

  // 組み込みアイコンの場合.
  switch (icon) {
    case E_ICON.ADD:
      return <AddIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.ATTENDANCE:
      return <AccessTimeIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.ARROW_BACK:
      return <ArrowBackIos sx={iconSx} onClick={onClick} />;
    case E_ICON.ARROW_LEFT:
      return <ArrowBackIosNewIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.ARROW_RIGHT:
      return <ArrowForwardIosIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.BUILD:
      return <BuildIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.CACHED:
      return <CachedIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.CAFE:
      return <LocalCafeIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.CIRCLE:
      return <CircleIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.CLEAR:
      return <ClearIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.DASHBOARD:
      return <DashboardIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.EXPAND_LESS:
      return <ExpandLess sx={iconSx} onClick={onClick} />;
    case E_ICON.EXPAND_MORE:
      return <ExpandMore sx={iconSx} onClick={onClick} />;
    case E_ICON.HOME:
      return <HomeIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.MENU:
      return <MenuIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.OFFICE:
      return <BusinessIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.REMOVE:
      return <RemoveIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.SHOP:
      return <ShoppingBasketIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.STAR:
      return <StarIcon sx={iconSx} onClick={onClick} />;
    case E_ICON.STAR_OUTLINE:
      return <StarOutlineIcon sx={iconSx} onClick={onClick} />;
    default:
      break;
  }

  return <StyledImg sx={iconSx} src={getIconPath(icon)} onClick={onClick} />;
};
