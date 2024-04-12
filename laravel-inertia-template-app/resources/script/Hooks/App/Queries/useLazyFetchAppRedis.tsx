import * as React from 'react';
import { useAppRedisLazyQuery } from '@/script/Graphql/codegen/graphql';

export interface IAppRedis {
  sampleArgument: string;
}

export function useLazyFetchAppRedis(): [
  boolean,
  (props: IAppRedis) => Promise<string>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [lazyQuery] = useAppRedisLazyQuery({});

  const lazyFetch = async (props: IAppRedis): Promise<string> => {
    setSending(true);

    return new Promise<string>(resolve => {
      lazyQuery({
        variables: {
          sample_argument: props.sampleArgument,
        },
        fetchPolicy: 'no-cache',
      }).then(async response => {
        setSending(false);

        resolve(response.data?.AppRedis.store_value ?? '');
      });
    });
  };

  return [sending, lazyFetch];
}
