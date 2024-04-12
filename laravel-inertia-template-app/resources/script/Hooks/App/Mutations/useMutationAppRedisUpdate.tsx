import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppRedisUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export interface IAppRedisUpdate {
  storeValue: string;
}

export function useMutationAppRedisUpdate(): [
  boolean,
  (
    props: IAppRedisUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppRedisUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数.
   */
  const mutationAppRedisUpdate = async (
    props: IAppRedisUpdate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          store_value: String(props.storeValue),
        },
      })
        .then(async response => {
          const statusCode = Number(response.data?.AppRedisUpdate?.status_code);

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
              response.data?.AppRedisUpdate?.status_message,
            ),
            errors: parseErrors(response.data?.AppRedisUpdate?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationAppRedisUpdate];
}
