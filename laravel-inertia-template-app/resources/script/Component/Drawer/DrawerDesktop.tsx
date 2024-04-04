import * as React from 'react';
import {
  Box,
  Drawer as MuiDrawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import {
  E_PAGES,
  EPages,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {}
export const DrawerDesktop: React.FC<IProps> = () => {
  /**
   * 表示するリンク.
   */
  const hrefList: EPages[] = [
    E_PAGES.MVC_VALUE,
    E_PAGES.INPUT_FORM,
    E_PAGES.REDIS,
    E_PAGES.SLACK_LOG,
  ];

  return (
    <MuiDrawer
      sx={{
        width: theme => theme.mixins.drawer?.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme => theme.mixins.drawer?.width,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box
        sx={{
          padding: '20px',
        }}
      >
        <Link href={getPagesHref(E_PAGES.DASHBOARD)} underline="none">
          <TypoText color={E_COLOR.TEXT_PRIMARY}>
            Laravel-Inertia-Template
          </TypoText>
        </Link>
        <List>
          {hrefList.map(page => {
            return (
              <ListItem key={page} disablePadding>
                <ListItemButton href={getPagesHref(page)}>
                  <ListItemText>{getPagesName(page)}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </MuiDrawer>
  );
};
