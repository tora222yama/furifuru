import { ApolloError } from '@apollo/client';
import { useUsecasesCalendarUserScheduleListQuery } from '@/script/Graphql/codegen/graphql';
import {
  IUsecasesCalendarUserSchedule,
  parseUsecasesCalendarUserSchedulePayload,
  UseCasesCalendarUserScheduleList,
} from '@/script/Models/Usecases/UsecasesCalendarUserScheduleList';

export interface IAppCalendarUserScheduleList {
  emailList: string[];
  startDate: string;
  endDate: string;
}

export function useFetchAppCalendarUserScheduleList(
  fetchParameter: IAppCalendarUserScheduleList,
): [boolean, UseCasesCalendarUserScheduleList, ApolloError | undefined] {
  /**
   * クエリ実施.
   */
  const query = useUsecasesCalendarUserScheduleListQuery({
    variables: {
      ...fetchParameter,
    },
  });

  // データのparse.
  const list = new UseCasesCalendarUserScheduleList(
    query.data?.UsecasesCalendarUserScheduleList.map(v =>
      parseUsecasesCalendarUserSchedulePayload(
        v as IUsecasesCalendarUserSchedule,
      ),
    ),
  );

  return [query.loading, list, query.error];
}
