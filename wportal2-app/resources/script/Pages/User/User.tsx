import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { UserList } from '@/script/Pages/User/UserList';

interface IProps extends IPropsBase {}
export const User: React.FC<IProps> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.USER)}</TypoH1>
      <UserList sx={{ marginTop: '20px' }} />
    </Page>
  );
};
