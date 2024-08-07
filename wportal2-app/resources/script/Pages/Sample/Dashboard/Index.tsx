import * as React from 'react';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { Dashboard } from '@/script/Pages/Dashboard/Dashboard';
import { IPropsBase } from '@/script/System/System';

interface IProps extends IPropsBase {}
export const Index: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <Dashboard />
    </CommonIndexProvider>
  );
};
export default Index;
