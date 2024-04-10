import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { Redis } from '@/script/Pages/Redis/Redis';

interface IProps extends IPropsBase {}
export const RedisIndex: React.FC<IProps> = ({ csrfToken, authUser }) => {
  return (
    <IndexProvider csrfToken={csrfToken} authUser={authUser}>
      <Redis />
    </IndexProvider>
  );
};
export default RedisIndex;
