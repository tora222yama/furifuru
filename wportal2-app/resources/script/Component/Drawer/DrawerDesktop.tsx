import * as React from 'react';
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_PAGES, PagesList } from '@/script/Enum/Server/App/EPages';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {}
export const DrawerDesktop: React.FC<IProps> = () => {
  return (
    <MuiDrawer
      sx={{
        position: 'fixed',
        height: '100vh',
        overflow: 'hidden',
        width: theme => theme.mixins.drawer?.width,

        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: theme => theme.mixins.drawer?.width,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
    >
      <Box
        sx={{
          marginTop: theme => theme.mixins.toolbar.height,
        }}
      >
        <List>
          {PagesList.filter(v => v.pages !== E_PAGES.INVALID).map(menu => {
            // TODO: 入れ子コンポーネントにする
            return (
              <ListItem
                key={menu.pages}
                sx={{
                  borderBottom: `1px solid ${E_COLOR.GREY}`,
                }}
                disablePadding
              >
                <InertiaLink sx={{ width: '100%' }} href={menu.href}>
                  <ListItemButton>
                    <Icon sx={{ marginRight: '10px' }} icon={menu.icon} />
                    <ListItemText>{menu.name}</ListItemText>
                  </ListItemButton>
                </InertiaLink>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </MuiDrawer>
  );
};
