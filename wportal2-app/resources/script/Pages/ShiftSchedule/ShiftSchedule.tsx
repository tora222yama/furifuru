import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { MonthCalendar } from '@/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar';
import {
  ShiftEntry,
  ShiftStartSettings,
} from '@/script/Pages/ShiftSchedule/Index';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
  startSettings?: ShiftStartSettings;
}

export const ShiftSchedule: React.FC<IProps> = ({
  shiftEntries,
  currentMonth,
  startSettings,
}) => {
  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.SHIFT_SCHEDULE)}</TypoH1>
      </Box>
      <MonthCalendar
        sx={{ marginTop: '20px' }}
        shiftEntries={shiftEntries}
        currentMonth={currentMonth}
        startSettings={startSettings}
      />
    </Page>
  );
};
