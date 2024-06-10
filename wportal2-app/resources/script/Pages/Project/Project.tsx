import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { ProjectList } from '@/script/Pages/Project/ProjectList';

interface IProps extends IPropsBase {}
export const Project: React.FC<IProps> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.PROJECT)}</TypoH1>
      <ProjectList sx={{ marginTop: '20px' }} />
    </Page>
  );
};
