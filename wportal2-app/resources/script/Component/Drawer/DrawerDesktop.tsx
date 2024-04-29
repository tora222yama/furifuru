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
import { getPagesHref, getPagesName } from '@/script/Enum/Server/App/EPages';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';

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
          padding: '20px',
        }}
      >
        <List>
          {[].map(page => {
            return (
              <ListItem key={page} disablePadding>
                <InertiaLink sx={{ width: '100%' }} href={getPagesHref(page)}>
                  <ListItemButton>
                    <ListItemText>{getPagesName(page)}</ListItemText>
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
