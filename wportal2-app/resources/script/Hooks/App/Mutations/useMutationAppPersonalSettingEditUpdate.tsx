import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppPersonalSettingEditUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

export interface IAppPersonalSettingEditUpdate {
  trnUserId: number;
  nickname: string;
  slackUserId: string;
  slackUserName: string;
  slackTeamId: string;
  upload?: File;
}

export function useMutationAppPersonalSettingEditUpdate(): [
  boolean,
  (
    props: IAppPersonalSettingEditUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppPersonalSettingEditUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppPersonalSettingEditUpdate = async (
    props: IAppPersonalSettingEditUpdate,
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
          response.data?.AppPersonalSettingEditUpdate?.statusCode,
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
            response.data?.AppPersonalSettingEditUpdate?.statusMessage,
          ),
          errors: parseErrors(
            response.data?.AppPersonalSettingEditUpdate?.errors,
          ),
        });
      });
    });
  };

  return [sending, mutationAppPersonalSettingEditUpdate];
}
