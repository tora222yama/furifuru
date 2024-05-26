import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppAttendanceStateCreateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { EAttendanceState } from '@/script/Enum/Server/App/EAttendanceState';

export interface IAppAttendanceStateCreate {
  eAttendanceState: EAttendanceState;
}

export function useMutationAppAttendanceStateCreate(): [
  boolean,
  (
    props: IAppAttendanceStateCreate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppAttendanceStateCreateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppAttendanceStateCreate = async (
    props: IAppAttendanceStateCreate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          eAttendanceState: Number(props.eAttendanceState),
        },
      }).then(async response => {
        const statusCode = Number(
          response.data?.AppAttendanceStateCreate?.statusCode,
        );

        if (statusCode === E_STATUS_CODE.OK && refetchQueries.length) {
          await client.refetchQueries({
            include: refetchQueries,
          });
        }

        // プロセス終了を通知.
        setSending(false);

        resolve({
          statusCode,
          statusMessage: String(
            response.data?.AppAttendanceStateCreate?.statusMessage,
          ),
          errors: parseErrors(response.data?.AppAttendanceStateCreate?.errors),
        });
      });
    });
  };

  return [sending, mutationAppAttendanceStateCreate];
}
