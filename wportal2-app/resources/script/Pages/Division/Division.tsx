import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { DivisionList } from '@/script/Pages/Division/DivisionList';

interface IProps extends IPropsBase {}
export const Division: React.FC<IProps> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.DIVISION)}</TypoH1>
      <DivisionList sx={{ marginTop: '20px' }} />
    </Page>
  );
};
