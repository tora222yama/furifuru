import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { IndexProvider } from '@/js/Provider/IndexProvider';
import { Dashboard } from '@/js/Pages/Dashboard/Dashboard';

interface IProps extends IPropsBase {}
export const DashboardIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <Dashboard />
    </IndexProvider>
  );
};
export default DashboardIndex;
