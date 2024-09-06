import * as React from 'react';
import { Divider, Grid } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSize } from '@/script/System/Responsive';
import { isActiveMenu, MenuList, mobileIgnoreList } from '@/script/Enum/EMenu';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { MobileIcon } from '@/script/Component/AppBar/MobileIcon';
import { E_ICON } from '@/script/Enum/EIcon';

interface IProps extends IPropsBase {}
export const MobileMenu: React.FC<IProps> = () => {
  const { trnUserAuthorityList } = useCommonIndexContext();
  const itemList = MenuList.filter(v => !mobileIgnoreList.includes(v.menu))
    .filter(v => v.pages !== E_PAGES.INVALID)
    .filter(v => isActiveMenu(v.menu, trnUserAuthorityList));

  return (
    <>
      <Grid
        sx={{
          width: '306px',
        }}
        container
      >
        {itemList.map(menu => {
          return (
            <Grid item xs={4} key={menu.menu}>
              <MobileIcon
                key={menu.menu}
                href={getPagesHref(menu.pages)}
                icon={menu.icon}
                label={menu.name}
              />
            </Grid>
          );
        })}
      </Grid>
      <Divider sx={{ margin: responsiveSize(8) }} />
      <MobileIcon
        href={getPagesHref(E_PAGES.PERSONAL_SETTING__SHOW)}
        icon={E_ICON.SETTING}
        label="個人設定"
      />
      <Divider sx={{ margin: responsiveSize(8) }} />
      <Grid
        sx={{
          width: '306px',
        }}
        container
      >
        <Grid item xs={4}>
          <MobileIcon
            href="https://docs.google.com/document/d/1lREZOhp2aJOwNavq2go9mXaDuJjsrlwRhroe0te9T2c/edit?usp=sharing"
            icon={E_ICON.LIBRARY_BOOKS}
            label="操作の手引き"
            target="_blank"
          />
        </Grid>
        <Grid item xs={4}>
          <MobileIcon
            href="https://docs.google.com/spreadsheets/d/1wYJkLvmAX-sCdvwzTAAu8vMQ9Gp6SiLFqKRzDIDwHAY/edit?usp=sharing"
            icon={E_ICON.DESCRIPTION}
            label="リリースノート"
            target="_blank"
          />
        </Grid>
      </Grid>
      <Divider sx={{ margin: '8px' }} />
      <MobileIcon href="/logout" icon={E_ICON.LOGOUT} label="ログアウト" />
    </>
  );
};
