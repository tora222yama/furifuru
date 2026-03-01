import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShiftSchedule } from '@/script/Pages/ShiftSchedule/ShiftSchedule';

export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

export type ShiftEntry = {
  date: string;
  type: ShiftType;
};

interface IProps extends IPropsBase {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
}

export const Index: React.FC<IProps> = ({
  shiftEntries,
  currentMonth,
  ...props
}) => {
  // noinspection TypeScriptValidateTypes
  return (
    <CommonIndexProvider {...props}>
      <ShiftSchedule shiftEntries={shiftEntries} currentMonth={currentMonth} />
    </CommonIndexProvider>
  );
};
export default Index;
