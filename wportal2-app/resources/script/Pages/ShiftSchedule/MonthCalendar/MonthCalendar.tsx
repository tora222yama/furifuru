import * as React from 'react';
import { Box, IconButton, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';
import { isHoliday } from 'japanese-holidays';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { Day } from '@/script/Pages/ShiftSchedule/MonthCalendar/Day';
import { getMonthCalendar } from '@/script/Common/getMonthCalendar';
import {
  E_WEEK_DAY,
  getWeekDayShortLabel,
} from '@/script/Enum/Server/App/EWeekDay';
import { ShiftEntry, ShiftType } from '@/script/Pages/ShiftSchedule/Index';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';

interface IProps extends IPropsBase {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
}

export const MonthCalendar: React.FC<IProps> = ({
  sx,
  shiftEntries,
  currentMonth,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (currentMonth) {
      return DateTime.parseString(`${currentMonth}-01`);
    }
    return DateTime.now();
  });

  const [shiftData, setShiftData] = useState<{ [key: string]: ShiftType }>(
    () => {
      const data: { [key: string]: ShiftType } = {};
      if (shiftEntries) {
        for (const entry of shiftEntries) {
          data[entry.date] = entry.type;
        }
      }
      return data;
    },
  );

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
    const entries: ShiftEntry[] = [];
    const startOfTarget = currentDate.startOfMonth();
    const endOfTarget = currentDate.endOfMonth();

    // 現在の月の日数をループしてデータを収集
    let target = startOfTarget;
    while (target.toJsTimeStamp() <= endOfTarget.toJsTimeStamp()) {
      const dateKey = target.toFormatString('yyyy-MM-dd');
      entries.push({
        date: dateKey,
        type: shiftData[dateKey] || getDefaultShift(target), // 未選択ならデフォルト値
      });
      target = target.addDay(1);
    }

    console.log('Shift Data (Current):', entries);
    alert('シフト状況（今月分）をログに出力しました。');
  };

  const weekDayList = Object.values(E_WEEK_DAY);

  return (
    <Box sx={{ ...sx }}>
      <Paper sx={{ padding: '16px' }}>
        <Box
          sx={{
            paddingTop: '10px',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <IconButton
            sx={{ color: E_COLOR.WHITE, background: E_COLOR.PRIMARY_MAIN }}
            onClick={handlePrevMonth}
          >
            <Icon icon={E_ICON.ARROW_LEFT} />
          </IconButton>
          <TypoH2>{currentDate.toFormatString('yyyy年MM月')}</TypoH2>
          <IconButton
            sx={{ color: E_COLOR.WHITE, background: E_COLOR.PRIMARY_MAIN }}
            onClick={handleNextMonth}
          >
            <Icon icon={E_ICON.ARROW_RIGHT} />
          </IconButton>
        </Box>
        <Box sx={{ borderBottom: `1px solid ${E_COLOR.GREY}` }}>
          <Box
            sx={{
              backgroundColor: E_COLOR.PRIMARY_MAIN,
              display: 'flex',
              height: '40px',
              borderRight: `1px solid ${E_COLOR.GREY}`,
            }}
          >
            {weekDayList.map(weekDay => (
              <Box
                key={weekDay}
                sx={{
                  width: 'calc(100% / 7)',
                  borderTop: `1px solid ${E_COLOR.GREY}`,
                  borderLeft: `1px solid ${E_COLOR.GREY}`,
                }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <TypoText color={E_COLOR.WHITE} bold>
                  {getWeekDayShortLabel(weekDay)}
                </TypoText>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, calc(100% / 7))',
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
                      shift={
                        shiftData[dateKey] || getDefaultShift(date.dateTime)
                      }
                      holidayName={isHoliday(date.dateTime.Date()) || undefined}
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
      </Paper>
    </Box>
  );
};
