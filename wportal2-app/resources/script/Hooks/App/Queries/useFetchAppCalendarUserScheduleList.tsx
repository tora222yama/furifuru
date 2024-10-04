import { ApolloError } from '@apollo/client';
import { useAppCalendarUserScheduleListQuery } from '@/script/Graphql/codegen/graphql';

export interface IAppCalendarUserScheduleList {
  emailList: string[];
  startDate: string;
  endDate: string;
}

export function useFetchAppCalendarUserScheduleList(
  fetchParameter: IAppCalendarUserScheduleList,
): [boolean, string[], ApolloError | undefined] {
  /**
   * クエリ実施.
   */
  const query = useAppCalendarUserScheduleListQuery({
    variables: {
      ...fetchParameter,
    },
  });

  return [
    query.loading,
    query.data?.AppCalendarUserScheduleList.map(v => v?.value ?? '') ?? [],
    query.error,
  ];
}
