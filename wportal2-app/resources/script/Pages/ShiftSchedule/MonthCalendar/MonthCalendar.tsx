import * as React from 'react';
import { Box, IconButton, Button, Paper } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isHoliday } from 'japanese-holidays';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { Day } from '@/script/Pages/ShiftSchedule/MonthCalendar/Day';
import { getMonthCalendar } from '@/script/Common/getMonthCalendar';
import {
  E_WEEK_DAY,
  getWeekDayShortLabel,
} from '@/script/Enum/Server/App/EWeekDay';
import {
  CalendarSyncStatus,
  DisplaySyncStatus,
  ShiftEntry,
  ShiftPageProps,
  ShiftType,
} from '@/script/Pages/ShiftSchedule/Index';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { useSnackbar } from '@/script/Provider/SnackbarProvider';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
}

export const MonthCalendar: React.FC<IProps> = ({
  sx,
  shiftEntries,
  currentMonth,
}) => {
  const { onStart, onFinish } = useProgressContext();
  const displaySnackbar = useSnackbar();

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

  // サーバーが最後に返したシフト種別（"未保存" 検出のために保持）
  const [serverShiftData, setServerShiftData] = useState<{
    [key: string]: ShiftType;
  }>(() => {
    const data: { [key: string]: ShiftType } = {};
    if (shiftEntries) {
      for (const entry of shiftEntries) {
        data[entry.date] = entry.type;
      }
    }
    return data;
  });

  // DB に保存された同期ステータス
  const [syncStatusData, setSyncStatusData] = useState<{
    [key: string]: CalendarSyncStatus;
  }>(() => {
    const data: { [key: string]: CalendarSyncStatus } = {};
    if (shiftEntries) {
      for (const entry of shiftEntries) {
        if (entry.syncStatus) {
          data[entry.date] = entry.syncStatus;
        }
      }
    }
    return data;
  });

  // Partial Reload で shiftEntries が更新されたとき、まだ shiftData にない日付だけマージする。
  // すでに存在するキー（ユーザーが変更済みの日付）は上書きしない。
  // serverShiftData / syncStatusData はサーバーが権威なので常に上書き。
  const prevShiftEntriesRef = useRef(shiftEntries);
  useEffect(() => {
    if (shiftEntries === prevShiftEntriesRef.current) {
      return;
    }
    prevShiftEntriesRef.current = shiftEntries;
    if (!shiftEntries) {
      return;
    }

    setShiftData(prev => {
      const next = { ...prev };
      for (const entry of shiftEntries) {
        if (!(entry.date in next)) {
          next[entry.date] = entry.type;
        }
      }
      return next;
    });

    setServerShiftData(prev => {
      const next = { ...prev };
      for (const entry of shiftEntries) {
        next[entry.date] = entry.type;
      }
      return next;
    });

    setSyncStatusData(prev => {
      const next = { ...prev };
      for (const entry of shiftEntries) {
        if (entry.syncStatus) {
          next[entry.date] = entry.syncStatus;
        } else {
          delete next[entry.date];
        }
      }
      return next;
    });
  }, [shiftEntries]);

  /**
   * 表示用ステータスを返す。
   * - ユーザーがサーバーと異なる値に変更済み → 'unsaved'
   * - DB 保存済みでサーバーから来たステータスあり → そのステータス
   * - 土日・祇日で未登録かつ未変更（送信時にスキップされる日）→ undefined（バッジ非表示）
   * - それ以外の未登録・未変更 → 'unregistered'
   */
  const getDisplaySyncStatus = (
    dateStr: string,
    dateTime: DateTime,
  ): DisplaySyncStatus | undefined => {
    const localType = shiftData[dateStr];
    const serverType = serverShiftData[dateStr];
    if (localType !== undefined && localType !== serverType) {
      return 'unsaved';
    }
    // 土日・祇日で未登録かつユーザーが未変更 → 送信スキップ対象なのでバッジ不要
    if (
      localType === undefined &&
      !syncStatusData[dateStr] &&
      getDefaultShift(dateTime) === 'holiday'
    ) {
      return undefined;
    }
    return syncStatusData[dateStr] ?? 'unregistered';
  };

  const dateList = useMemo(() => getMonthCalendar(currentDate), [currentDate]);

  const handleFlash = (props: ShiftPageProps) => {
    if (props.flash?.status === 'stored') {
      displaySnackbar('シフトを保存しました');
    } else if (props.flash?.status === 'stored_with_errors') {
      const failCount = props.shiftSync?.failures.length ?? 0;
      displaySnackbar(
        `シフトを保存しましたが、${failCount}件のカレンダー同期に失敗しました`,
      );
    }
  };

  const handlePrevMonth = () => {
    const newDate = currentDate.subMonth(1);
    setCurrentDate(newDate);
    router.get(
      getPagesHref(E_PAGES.SHIFT_SCHEDULE),
      { month: newDate.toFormatString('yyyy-MM') },
      {
        only: ['shiftEntries', 'currentMonth'],
        preserveState: true,
        preserveScroll: true,
        onStart,
        onFinish,
      },
    );
  };

  const handleNextMonth = () => {
    const newDate = currentDate.addMonth(1);
    setCurrentDate(newDate);
    router.get(
      getPagesHref(E_PAGES.SHIFT_SCHEDULE),
      { month: newDate.toFormatString('yyyy-MM') },
      {
        only: ['shiftEntries', 'currentMonth'],
        preserveState: true,
        preserveScroll: true,
        onStart,
        onFinish,
      },
    );
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
      const savedType = shiftData[dateKey];

      // 土日・祇日で未登録かつユーザーが明示的に変更していない場合は送信スキップ
      if (savedType === undefined && getDefaultShift(target) === 'holiday') {
        target = target.addDay(1);
        continue;
      }

      entries.push({
        date: dateKey,
        type: savedType ?? getDefaultShift(target),
      });
      target = target.addDay(1);
    }

    router.post(
      getPagesHref(E_PAGES.SHIFT_SCHEDULE__STORE),
      { shifts: entries },
      {
        onStart,
        onFinish,
        onSuccess: page => handleFlash(page.props as ShiftPageProps),
      },
    );
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
                      syncStatus={getDisplaySyncStatus(dateKey, date.dateTime)}
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
