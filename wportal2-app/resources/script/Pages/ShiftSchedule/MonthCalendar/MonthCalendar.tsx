import * as React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { Day } from '@/script/Pages/ShiftSchedule/MonthCalendar/Day';
import { getMonthCalendar } from '@/script/Common/getMonthCalendar';

interface IProps extends IPropsBase {}
export const MonthCalendar: React.FC<IProps> = ({ sx }) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const dateList = useMemo(() => getMonthCalendar(currentDate), [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subMonth(1));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.addMonth(1));
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Box sx={{ ...sx }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '16px 0',
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ margin: '0 16px' }}>
          {currentDate.toFormatString('yyyy年MM月')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: `1px solid ${E_COLOR.GREY}` }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
          }}
        >
          {weekDays.map(day => (
            <Box
              key={day}
              sx={{
                padding: '8px',
                borderTop: `1px solid ${E_COLOR.GREY}`,
                borderLeft: `1px solid ${E_COLOR.GREY}`,
                borderRight: `1px solid ${E_COLOR.GREY}`,
              }}
            >
              <Typography>{day}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderRight: `1px solid ${E_COLOR.GREY}`,
          }}
        >
          {dateList.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dayIndex) => (
                <Day key={dayIndex} date={date} />
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
