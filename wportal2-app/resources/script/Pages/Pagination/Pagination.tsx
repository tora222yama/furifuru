import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { Page } from '@/script/Pages/Page';
import { PaginationList } from '@/script/Pages/Pagination/PaginationList';
import { FixList } from '@/script/Pages/Pagination/FixList';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { GraphQLPaginationList } from '@/script/Pages/Pagination/GraphQLPaginationList';

interface IPros extends IPropsBase {}
export const Pagination: React.FC<IPros> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.PAGINATION)}</TypoH1>
      <TypoH3 sx={{ marginTop: '20px' }}>
        InertiaのControllerによるページネーション
      </TypoH3>
      <PaginationList sx={{ marginTop: '20px' }} />
      <TypoH3 sx={{ marginTop: '20px' }}>GraphQLによるページネーション</TypoH3>
      <GraphQLPaginationList sx={{ marginTop: '20px' }} />
      <TypoH3 sx={{ marginTop: '20px' }}>
        以下はPartialLoad確認用の固定リスト
      </TypoH3>
      <FixList sx={{ marginTop: '10px' }} />
    </Page>
  );
};
