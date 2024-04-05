import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { Dashboard } from '@/script/Pages/Dashboard/Dashboard';

interface IProps extends IPropsBase {}
export const DashboardIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <Dashboard />
    </IndexProvider>
  );
};
export default DashboardIndex;
