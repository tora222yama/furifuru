import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { useAppPaginationQuery } from '@/script/Graphql/codegen/graphql';
import {
  AppTrnFacilityList,
  parseAppTrnFacilityPayload,
} from '@/script/Models/App/Trn/TrnFacilityList';
import { IOffsetPagination } from '@/script/Hooks/IOffsetPagination';

export interface IAppPagination {
  pagination: IOffsetPagination;
}
export interface IAppPaginationResponse {
  list: AppTrnFacilityList;
  count: number;
}

export function useFetchAppPagination(
  fetchParameter: IAppPagination,
): [
  boolean,
  number,
  AppTrnFacilityList,
  (pagination: IOffsetPagination) => void,
  ApolloError | undefined,
] {
  const [cursor, setCursor] = React.useState<IOffsetPagination>({
    pageIndex: fetchParameter.pagination.pageIndex,
    pageStep: fetchParameter.pagination.pageStep,
  });

  /**
   * クエリ実施.
   */
  const query = useAppPaginationQuery({
    variables: {
      page_index: cursor.pageIndex,
      page_step: cursor.pageStep,
    },
    fetchPolicy: 'no-cache',
  });

  // データのparse処理.
  const list = new AppTrnFacilityList(
    query.data?.AppPagination.list.map(v => parseAppTrnFacilityPayload(v)),
  );
  const count = query.data?.AppPagination.count ?? 0;

  // カーソル変更処理.
  const changeCursor = (pagination: IOffsetPagination) => {
    setCursor(pagination);
  };

  return [query.loading, count, list, changeCursor, query.error];
}
