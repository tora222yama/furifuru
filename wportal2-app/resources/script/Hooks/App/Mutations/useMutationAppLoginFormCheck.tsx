import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppLoginFormCheckMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export function useMutationAppLoginFormCheck(): [
  boolean,
  (refetchQueries: DocumentNode[]) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppLoginFormCheckMutation();
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppLoginFormCheck = async (
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({})
        .then(async response => {
          const statusCode = Number(
            response.data?.AppLoginFormCheck?.status_code,
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
              response.data?.AppLoginFormCheck?.status_message,
            ),
            errors: parseErrors(response.data?.AppLoginFormCheck?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationAppLoginFormCheck];
}
