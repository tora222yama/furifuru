import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { SeatingChart } from '@/script/Pages/SeatingChart/SeatingChart';
import { SeatingChartProvider } from '@/script/Provider/SeatingChartProvider';

interface IProps extends IPropsBase {
  seats?: Array<{
    id: number;
    label: string;
    positionX: number;
    positionY: number;
    phoneNumber: string;
  }>;
}
export const Index: React.FC<IProps> = ({ seats = [], ...props }) => {
  return (
    <CommonIndexProvider {...props}>
      <SeatingChartProvider seats={seats}>
        <SeatingChart />
      </SeatingChartProvider>
    </CommonIndexProvider>
  );
};
export default Index;
