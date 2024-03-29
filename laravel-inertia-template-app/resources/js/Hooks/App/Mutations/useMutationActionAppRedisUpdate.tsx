import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/js/Hooks/IMutationResult';
import { useActionAppRedisUpdateMutation } from '@/js/Graphql/codegen/graphql';

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
          store_value: props.storeValue,
        },
      })
        .then(async response => {
          const statusCode = Number(
            response.data?.ActionAppRedisUpdate?.status_code,
          );

          // TODO: Enumの同期.
          if (statusCode === 200 && refetchQueries.length) {
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
