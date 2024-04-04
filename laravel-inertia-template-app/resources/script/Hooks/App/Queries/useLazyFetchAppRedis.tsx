import * as React from 'react';
import { useAppRedisLazyQuery } from '@/script/Graphql/codegen/graphql';

export function useLazyFetchAppRedis(): [boolean, () => Promise<string>] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [lazyQuery] = useAppRedisLazyQuery({});

  const lazyFetch = async (): Promise<string> => {
    setSending(true);

    return new Promise<string>(resolve => {
      lazyQuery({
        fetchPolicy: 'no-cache',
      }).then(async response => {
        setSending(false);

        resolve(response.data?.AppRedis.store_value ?? '');
      });
    });
  };

  return [sending, lazyFetch];
}
