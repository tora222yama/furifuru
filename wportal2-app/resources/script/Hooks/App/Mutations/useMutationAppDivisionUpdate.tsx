import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppDivisionUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IAppDivisionUpdate {
  trnDivisionId: number;
  name: string;
  explain: string;
}

export function useMutationAppDivisionUpdate(): [
  boolean,
  (
    props: IAppDivisionUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppDivisionUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppDivisionUpdate = async (
    props: IAppDivisionUpdate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          ...props,
        },
      }).then(async response => {
        const statusCode = Number(response.data?.AppDivisionUpdate?.statusCode);

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
            response.data?.AppDivisionUpdate?.statusMessage,
          ),
          errors: parseErrors(response.data?.AppDivisionUpdate?.errors),
        });
      });
    });
  };

  return [sending, mutationAppDivisionUpdate];
}
