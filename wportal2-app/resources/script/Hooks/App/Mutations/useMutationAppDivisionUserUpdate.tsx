import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppDivisionUserUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IAppDivisionUserUpdate {
  trnDivisionId: number;
  trnUserIdList: number[];
}

export function useMutationAppDivisionUserUpdate(): [
  boolean,
  (
    props: IAppDivisionUserUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppDivisionUserUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppDivisionUserUpdate = async (
    props: IAppDivisionUserUpdate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          ...props,
        },
      }).then(async response => {
        const statusCode = Number(
          response.data?.AppDivisionUserUpdate?.statusCode,
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
            response.data?.AppDivisionUserUpdate?.statusMessage,
          ),
          errors: parseErrors(response.data?.AppDivisionUserUpdate?.errors),
        });
      });
    });
  };

  return [sending, mutationAppDivisionUserUpdate];
}
