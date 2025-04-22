import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { SeatingChart } from '@/script/Pages/SeatingChart/SeatingChart';

interface IProps extends IPropsBase {}
export const Index: React.FC<IProps> = ({ ...props }) => {
  return (
    <CommonIndexProvider {...props}>
      <SeatingChart />
    </CommonIndexProvider>
  );
};
export default Index;
