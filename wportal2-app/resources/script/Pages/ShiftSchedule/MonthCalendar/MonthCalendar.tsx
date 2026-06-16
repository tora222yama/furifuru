import * as React from 'react';
import {
  Box,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  ShiftStartSettings,
  ShiftStartTime,
  ShiftType,
  SHIFT_START_TIME_OPTIONS,
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
  startSettings?: ShiftStartSettings;
}

const defaultStartSettings = (
  settings?: ShiftStartSettings,
): ShiftStartSettings => ({
  officeStartTime: settings?.officeStartTime ?? '09:00',
  remoteStartTime: settings?.remoteStartTime ?? '09:00',
});

export const MonthCalendar: React.FC<IProps> = ({
  sx,
  shiftEntries,
  currentMonth,
  startSettings,
}) => {
  const { onStart, onFinish } = useProgressContext();
  const displaySnackbar = useSnackbar();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const initialStartSettings = useMemo(
    () => defaultStartSettings(startSettings),
    [startSettings],
  );

  // 在宅・出社の勤務開始時刻（9:00〜11:00、30分刻り）
  const [officeStartTime, setOfficeStartTime] = React.useState<ShiftStartTime>(
    initialStartSettings.officeStartTime as ShiftStartTime,
  );
  const [remoteStartTime, setRemoteStartTime] = React.useState<ShiftStartTime>(
    initialStartSettings.remoteStartTime as ShiftStartTime,
  );
  const [serverStartSettings, setServerStartSettings] =
    React.useState<ShiftStartSettings>(initialStartSettings);

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

  // ── 未保存変更の検知 ──
  const hasUnsavedChanges = useCallback((): boolean => {
    if (
      officeStartTime !== serverStartSettings.officeStartTime ||
      remoteStartTime !== serverStartSettings.remoteStartTime
    ) {
      return true;
    }

    for (const [date, localType] of Object.entries(shiftData)) {
      if (localType !== serverShiftData[date]) {
        return true;
      }
    }
    return false;
  }, [
    officeStartTime,
    remoteStartTime,
    serverStartSettings,
    shiftData,
    serverShiftData,
  ]);

  // タブ閉じ・リロード時の離脱確認
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // Inertia ナビゲーション（メニュー遷移等）時の離脱確認
  // 月送り（preserveState）や送信（POST）は対象外
  useEffect(() => {
    const removeListener = router.on('before', event => {
      const visit = event.detail.visit;
      if (visit.preserveState || visit.method !== 'get') {
        return;
      }
      if (
        hasUnsavedChanges() &&
        !window.confirm('変更が保存されていません。ページを離れますか？')
      ) {
        event.preventDefault();
      }
    });
    return () => removeListener();
  }, [hasUnsavedChanges]);

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
        `シフトを保存しましたが、${failCount}件のカレンダー反映に失敗しました`,
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

  const handleSubmitConfirm = () => {
    if (!hasUnsavedChanges()) {
      displaySnackbar('変更されたシフトがありません');
      return;
    }

    setConfirmOpen(true);
  };

  const handleSubmit = () => {
    setConfirmOpen(false);
    const entries: ShiftEntry[] = [];
    const startOfTarget = currentDate.startOfMonth();
    const endOfTarget = currentDate.endOfMonth();
    const officeStartTimeChanged =
      officeStartTime !== serverStartSettings.officeStartTime;
    const remoteStartTimeChanged =
      remoteStartTime !== serverStartSettings.remoteStartTime;
    const startTimeChanged = officeStartTimeChanged || remoteStartTimeChanged;

    // 現在の月の日数をループしてデータを収集
    let target = startOfTarget;
    while (target.toJsTimeStamp() <= endOfTarget.toJsTimeStamp()) {
      const dateKey = target.toFormatString('yyyy-MM-dd');
      const savedType = shiftData[dateKey];
      const serverType = serverShiftData[dateKey];
      const localChanged = savedType !== serverType;
      const effectiveType = savedType ?? getDefaultShift(target);

      if (!localChanged && !startTimeChanged) {
        target = target.addDay(1);
        continue;
      }

      if (!localChanged && startTimeChanged) {
        if (serverType === undefined) {
          target = target.addDay(1);
          continue;
        }

        const shouldResyncByStartTime =
          (serverType === 'office' && officeStartTimeChanged) ||
          (serverType === 'remote' && remoteStartTimeChanged);

        if (!shouldResyncByStartTime) {
          target = target.addDay(1);
          continue;
        }
      }

      entries.push({
        date: dateKey,
        type: effectiveType,
      });
      target = target.addDay(1);
    }

    if (entries.length === 0 && !startTimeChanged) {
      displaySnackbar('変更されたシフトがありません');
      return;
    }

    router.post(
      getPagesHref(E_PAGES.SHIFT_SCHEDULE__STORE),
      {
        shifts: entries,
        officeStartTime,
        remoteStartTime,
      },
      {
        onStart,
        onFinish,
        onSuccess: page => {
          setServerStartSettings({ officeStartTime, remoteStartTime });
          handleFlash(page.props as ShiftPageProps);
        },
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
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* 勤務開始時刻設定 */}
          <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>出社 勤務開始時刻</InputLabel>
              <Select
                value={officeStartTime}
                label="出社 勤務開始時刻"
                onChange={e =>
                  setOfficeStartTime(e.target.value as ShiftStartTime)
                }
              >
                {SHIFT_START_TIME_OPTIONS.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>在宅 勤務開始時刻</InputLabel>
              <Select
                value={remoteStartTime}
                label="在宅 勤務開始時刻"
                onChange={e =>
                  setRemoteStartTime(e.target.value as ShiftStartTime)
                }
              >
                {SHIFT_START_TIME_OPTIONS.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitConfirm}
          >
            送信
          </Button>
        </Box>
      </Paper>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>シフト登録の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            変更したシフトを登録します
            <br />
            ※反映に1〜2分ほどかかります
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            登録する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
