import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { IndexProvider } from '@/js/Provider/IndexProvider';
import { Redis } from '@/js/Pages/Redis/Redis';

interface IProps extends IPropsBase {}
export const RedisIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <Redis />
    </IndexProvider>
  );
};
export default RedisIndex;
