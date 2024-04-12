import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { SlackLog } from '@/script/Pages/SlackLog/SlackLog';

interface IProps extends IPropsBase {}
export const SlackLogIndex: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IndexProvider {...props}>
      <SlackLog />
    </IndexProvider>
  );
};
export default SlackLogIndex;
