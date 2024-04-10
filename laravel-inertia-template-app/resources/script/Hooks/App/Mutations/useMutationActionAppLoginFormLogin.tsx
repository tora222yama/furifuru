import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useActionAppLoginFormLoginMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export interface IActionAppLoginFormLogin {
  email: string;
  password: string;
}

export function useMutationActionAppLoginFormLogin(): [
  boolean,
  (
    props: IActionAppLoginFormLogin,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useActionAppLoginFormLoginMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationActionAppLoginFormLogin = async (
    props: IActionAppLoginFormLogin,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          email: String(props.email),
          password: String(props.password),
        },
      })
        .then(async response => {
          const statusCode = Number(
            response.data?.ActionAppLoginFormLogin?.status_code,
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
              response.data?.ActionAppLoginFormLogin?.status_message,
            ),
            errors: parseErrors(response.data?.ActionAppLoginFormLogin?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationActionAppLoginFormLogin];
}
