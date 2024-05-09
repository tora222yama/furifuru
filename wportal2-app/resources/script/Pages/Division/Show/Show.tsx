import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { BackLink } from '@/script/Pages/Common/BackLink';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  return (
    <Page>
      <BackLink current={E_PAGES.DIVISION__SHOW} />
      <TypoH1>{getPagesName(E_PAGES.DIVISION__SHOW)}</TypoH1>
    </Page>
  );
};
