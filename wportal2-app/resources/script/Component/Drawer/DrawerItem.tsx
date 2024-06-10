import * as React from 'react';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_ICON } from '@/script/Enum/EIcon';
import {
  hasChildMenu,
  IMenu,
  isActiveMenu,
  MenuList,
} from '@/script/Enum/EMenu';

interface IProps extends IPropsBase {
  menu: IMenu;
  depth: number;
}

export const DrawerItem: React.FC<IProps> = ({ sx, menu, depth }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const depthPadding = `${depth * 10 + 20}px`;

  if (hasChildMenu(menu.menu)) {
    return (
      <>
        <Box
          sx={{
            width: '100%',
            padding: '12px 20px',
            paddingLeft: depthPadding,
            display: 'flex',
            borderBottom: `1px solid ${E_COLOR.GREY}`,
            justifyContent: 'space-between',
            transition: 'background-color .2s ease-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          onClick={() => setOpen(!open)}
        >
          <TypoText>{menu.name}</TypoText>
          <Icon icon={open ? E_ICON.EXPAND_LESS : E_ICON.EXPAND_MORE} />
        </Box>
        <Collapse in={open}>
          <List disablePadding>
            {MenuList.filter(v => v.pages !== E_PAGES.INVALID)
              .filter(v => v.parent === menu.menu)
              .filter(v => isActiveMenu(v.menu))
              .map(menu => (
                <DrawerItem key={menu.menu} menu={menu} depth={depth + 1} />
              ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItem
      key={menu.pages}
      sx={{
        borderBottom: `1px solid ${E_COLOR.GREY}`,
        ...sx,
      }}
      disablePadding
    >
      <InertiaLink sx={{ width: '100%' }} href={getPagesHref(menu.pages)}>
        <ListItemButton
          sx={{
            paddingLeft: depthPadding,
          }}
        >
          <Icon sx={{ marginRight: '10px' }} icon={menu.icon} />
          <ListItemText>{menu.name}</ListItemText>
        </ListItemButton>
      </InertiaLink>
    </ListItem>
  );
};
