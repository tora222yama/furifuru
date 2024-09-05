import * as React from 'react';
import { Divider, MenuItem } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSize } from '@/script/System/Responsive';
import { PersonalSetting } from '@/script/Component/AppBar/MenuItem/PersonalSetting';
import { Manual } from '@/script/Component/AppBar/MenuItem/Manual';
import { ReleaseNote } from '@/script/Component/AppBar/MenuItem/ReleaseNote';
import { Logout } from '@/script/Component/AppBar/MenuItem/Logout';
import { isActiveMenu, MenuList, mobileIgnoreList } from '@/script/Enum/EMenu';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';

interface IProps extends IPropsBase {}
export const MobileMenu: React.FC<IProps> = () => {
  const { trnUserAuthorityList } = useCommonIndexContext();
  const itemList = MenuList.filter(v => !mobileIgnoreList.includes(v.menu))
    .filter(v => v.pages !== E_PAGES.INVALID)
    .filter(v => isActiveMenu(v.menu, trnUserAuthorityList));

  return (
    <>
      {itemList.map(menu => {
        return (
          <MenuItem
            key={menu.menu}
            sx={{
              minHeight: responsiveSize(40),
            }}
          >
            <InertiaLink sx={{ width: '100%' }} href={getPagesHref(menu.pages)}>
              <TypoText>{menu.name}</TypoText>
            </InertiaLink>
          </MenuItem>
        );
      })}
      <Divider sx={{ margin: responsiveSize(8) }} />
      <PersonalSetting />
      <Divider sx={{ margin: responsiveSize(8) }} />
      <Manual />
      <ReleaseNote />
      <Divider sx={{ margin: '8px' }} />
      <Logout />
    </>
  );
};
