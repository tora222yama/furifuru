import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppLoginFormLoginMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export interface IAppLoginFormLogin {
  email: string;
  password: string;
}

export function useMutationAppLoginFormLogin(): [
  boolean,
  (
    props: IAppLoginFormLogin,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppLoginFormLoginMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppLoginFormLogin = async (
    props: IAppLoginFormLogin,
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
            response.data?.AppLoginFormLogin?.status_code,
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
              response.data?.AppLoginFormLogin?.status_message,
            ),
            errors: parseErrors(response.data?.AppLoginFormLogin?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationAppLoginFormLogin];
}
