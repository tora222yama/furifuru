import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppProjectUserUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IAppProjectUserUpdate {
  trnProjectId: number;
  trnUserIdList: number[];
}

export function useMutationAppProjectUserUpdate(): [
  boolean,
  (
    props: IAppProjectUserUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppProjectUserUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppProjectUserUpdate = async (
    props: IAppProjectUserUpdate,
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
          response.data?.AppProjectUserUpdate?.statusCode,
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
            response.data?.AppProjectUserUpdate?.statusMessage,
          ),
          errors: parseErrors(response.data?.AppProjectUserUpdate?.errors),
        });
      });
    });
  };

  return [sending, mutationAppProjectUserUpdate];
}
