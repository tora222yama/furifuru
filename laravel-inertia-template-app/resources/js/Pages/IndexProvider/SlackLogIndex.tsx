import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { IndexProvider } from '@/js/Provider/IndexProvider';
import { SlackLog } from '@/js/Pages/SlackLog/SlackLog';

interface IProps extends IPropsBase {}
export const SlackLogIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <SlackLog />
    </IndexProvider>
  );
};
export default SlackLogIndex;
