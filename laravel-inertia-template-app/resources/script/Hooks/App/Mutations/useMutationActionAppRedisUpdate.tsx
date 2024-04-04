import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useActionAppRedisUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IActionAppRedisUpdate {
  storeValue: string;
}

export function useMutationActionAppRedisUpdate(): [
  boolean,
  (
    props: IActionAppRedisUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useActionAppRedisUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数.
   */
  const mutationActionAppRedisUpdate = async (
    props: IActionAppRedisUpdate,
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
          const statusCode = Number(
            response.data?.ActionAppRedisUpdate?.status_code,
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
              response.data?.ActionAppRedisUpdate?.status_message,
            ),
            errors: parseErrors(response.data?.ActionAppRedisUpdate?.errors),
          });
        })
        .catch(_error => {
          setSending(false);
        });
    });
  };

  return [sending, mutationActionAppRedisUpdate];
}
