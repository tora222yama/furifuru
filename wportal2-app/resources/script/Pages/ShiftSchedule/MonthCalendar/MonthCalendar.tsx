import * as React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { isHoliday } from 'japanese-holidays';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { Day } from '@/script/Pages/ShiftSchedule/MonthCalendar/Day';
import { getMonthCalendar } from '@/script/Common/getMonthCalendar';
import { E_WEEK_DAY } from '@/script/Enum/Server/App/EWeekDay';

interface IProps extends IPropsBase {}

export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

export const MonthCalendar: React.FC<IProps> = ({ sx }) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [shiftData, setShiftData] = useState<{ [key: string]: ShiftType }>({});

  const dateList = useMemo(() => getMonthCalendar(currentDate), [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subMonth(1));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.addMonth(1));
  };

  const handleShiftChange = (dateStr: string, shift: ShiftType) => {
    setShiftData(prev => ({ ...prev, [dateStr]: shift }));
  };

  const getDefaultShift = (date: DateTime): ShiftType => {
    const weekDay = date.getWeekDay();
    const isWeekend =
      weekDay === E_WEEK_DAY.SATURDAY || weekDay === E_WEEK_DAY.SUNDAY;
    const isHolidayDate = isHoliday(date.Date());

    if (isWeekend || isHolidayDate) {
      return 'holiday';
    }
    return 'remote';
  };

  const handleSubmit = () => {
    const logs: { date: string; shift: ShiftType }[] = [];
    const startOfTarget = currentDate.startOfMonth();
    const endOfTarget = currentDate.endOfMonth();

    // 現在の月の日数をループしてデータを収集
    let target = startOfTarget;
    while (target.toJsTimeStamp() <= endOfTarget.toJsTimeStamp()) {
      const dateKey = target.toFormatString('yyyy-MM-dd');
      logs.push({
        date: dateKey,
        shift: shiftData[dateKey] || getDefaultShift(target), // 未選択ならデフォルト値
      });
      target = target.addDay(1);
    }

    console.log('Shift Data (Current):', logs);
    alert('シフト状況（今月分）をログに出力しました。');
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
              {week.map(date => {
                const dateKey = date.dateTime.toFormatString('yyyy-MM-dd');
                return (
                  <Day
                    key={dateKey}
                    date={date}
                    shift={shiftData[dateKey] || getDefaultShift(date.dateTime)}
                    onShiftChange={val => handleShiftChange(dateKey, val)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          送信
        </Button>
      </Box>
    </Box>
  );
};
