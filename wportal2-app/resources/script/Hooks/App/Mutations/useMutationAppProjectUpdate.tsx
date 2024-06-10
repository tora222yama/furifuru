import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppProjectUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IAppProjectUpdate {
  trnProjectId: number;
  name: string;
  explain: string;
}

export function useMutationAppProjectUpdate(): [
  boolean,
  (
    props: IAppProjectUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppProjectUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppProjectUpdate = async (
    props: IAppProjectUpdate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          ...props,
        },
      }).then(async response => {
        const statusCode = Number(response.data?.AppProjectUpdate?.statusCode);

        if (statusCode === E_STATUS_CODE.OK && refetchQueries.length) {
          await client.refetchQueries({
            include: refetchQueries,
          });
        }

        // プロセス終了を通知.
        setSending(false);

        resolve({
          statusCode,
          statusMessage: String(response.data?.AppProjectUpdate?.statusMessage),
          errors: parseErrors(response.data?.AppProjectUpdate?.errors),
        });
      });
    });
  };

  return [sending, mutationAppProjectUpdate];
}
