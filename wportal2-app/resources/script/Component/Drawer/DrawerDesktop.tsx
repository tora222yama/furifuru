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
import { useIndexContext } from '@/script/Provider/IndexProvider';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';

interface IProps extends IPropsBase {}
export const DrawerDesktop: React.FC<IProps> = () => {
  const { authUser } = useIndexContext();

  /**
   * 表示するリンク.
   */
  const hrefList: EPages[] = [
    E_PAGES.MVC_VALUE,
    E_PAGES.INPUT_FORM,
    E_PAGES.REDIS,
    E_PAGES.SLACK_LOG,
    E_PAGES.LOGIN_FORM,
    E_PAGES.PAGINATION,
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
          <TypoText color={E_COLOR.TEXT_PRIMARY}>wportal2</TypoText>
        </Link>
        <Box
          sx={{
            marginTop: '10px',
            padding: '5px',
            backgroundColor: E_COLOR.RED_LIGHT,
          }}
        >
          <TypoText>login：{authUser.id ? authUser.name : '----'}</TypoText>
        </Box>
        <List>
          {hrefList.map(page => {
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
