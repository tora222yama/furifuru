import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { MonthCalendar } from '@/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar';

interface IProps extends IPropsBase {}
export const ShiftSchedule: React.FC<IProps> = () => {
  return (
    <Page>
      <Box sx={{ padding: '24px' }}>
        <MonthCalendar />
      </Box>
    </Page>
  );
};
