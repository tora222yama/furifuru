import * as React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { E_WEEK_DAY } from '@/script/Enum/Server/App/EWeekDay';
import { DateTime } from '@/script/Common/DateTime';
import { Day, IDate } from '@/script/Pages/ShiftSchedule/MonthCalendar/Day';

interface IProps extends IPropsBase {}
export const MonthCalendar: React.FC<IProps> = ({ sx }) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());

  const dateList = useMemo(() => {
    const ret: IDate[][] = [];
    const targetDateList: IDate[] = [];
    const DAYS_IN_WEEK = Object.values(E_WEEK_DAY).length;
    const startOfMonth = currentDate.startOfMonth();
    const endOfMonth = currentDate.endOfMonth();
    const daysInMonth = currentDate.daysInMonth();
    const daysInBefore = startOfMonth.getWeekDay();
    const mod = DAYS_IN_WEEK - ((daysInBefore + daysInMonth) % DAYS_IN_WEEK);
    const daysInAfter = mod === DAYS_IN_WEEK ? 0 : mod;
    const dayNum = daysInBefore + daysInMonth + daysInAfter;
    const firstDate = startOfMonth.subDay(daysInBefore);

    for (let i = 0; i < dayNum; ++i) {
      const targetDate = firstDate.addDay(i);
      targetDateList.push({
        dateTime: targetDate,
        inRange: targetDate.inRange(startOfMonth, endOfMonth),
      });
    }

    while (targetDateList.length > 0) {
      ret.push(targetDateList.splice(0, DAYS_IN_WEEK));
    }
    return ret;
  }, [currentDate]);

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
