import * as React from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { IMutationResult, parseErrors } from '@/script/Hooks/IMutationResult';
import { useAppInputFormUpdateMutation } from '@/script/Graphql/codegen/graphql';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';

export interface IAppInputFormUpdate {
  inputSingleNumber: string;
  inputSingleNotZero: string;
  inputSingleRange: string;
  inputSingleEmail: string;
  inputMulti: string;
}

export function useMutationAppInputFormUpdate(): [
  boolean,
  (
    props: IAppInputFormUpdate,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useAppInputFormUpdateMutation({});
  const client = useApolloClient();

  /**
   * 送信関数
   */
  const mutationAppInputFormUpdate = async (
    props: IAppInputFormUpdate,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);

    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: {
          input_single_number: String(props.inputSingleNumber),
          input_single_not_zero: String(props.inputSingleNotZero),
          input_single_range: String(props.inputSingleRange),
          input_single_email: String(props.inputSingleEmail),
          input_multi: String(props.inputMulti),
        },
      })
        .then(async response => {
          const statusCode = Number(
            response.data?.AppInputFormUpdate?.status_code,
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
              response.data?.AppInputFormUpdate?.status_message,
            ),
            errors: parseErrors(response.data?.AppInputFormUpdate?.errors),
          });
        })
        .catch(_error => {
          Log.error(_error);
          setSending(false);
        });
    });
  };

  return [sending, mutationAppInputFormUpdate];
}
