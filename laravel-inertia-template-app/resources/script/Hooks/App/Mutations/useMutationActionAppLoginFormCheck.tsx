import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useActionAppLoginFormCheckMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export function useMutationActionAppLoginFormCheck(): [
  boolean,
  (refetchQueries: DocumentNode[]) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useActionAppLoginFormCheckMutation();
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationActionAppLoginFormCheck = async (
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({})
        .then(async response => {
          const statusCode = Number(
            response.data?.ActionAppLoginFormCheck?.status_code,
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
              response.data?.ActionAppLoginFormCheck?.status_message,
            ),
            errors: parseErrors(response.data?.ActionAppLoginFormCheck?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationActionAppLoginFormCheck];
}
