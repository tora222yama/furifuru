import * as React from 'react';
import { Box, Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { MonthCalendar } from '@/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar';
import {
  ShiftEntry,
  ShiftStartSettings,
} from '@/script/Pages/ShiftSchedule/Index';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';

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
          alignItems: 'center',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.SHIFT_SCHEDULE)}</TypoH1>
        <Button
          variant="outlined"
          startIcon={<Download />}
          href={`${getPagesHref(E_PAGES.SHIFT_SCHEDULE__EXPORT)}?month=${currentMonth ?? ''}`}
        >
          CSV出力
        </Button>
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
