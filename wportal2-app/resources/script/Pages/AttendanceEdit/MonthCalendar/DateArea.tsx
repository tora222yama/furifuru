import * as React from 'react';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { E_WEEK_DAY } from '@/script/Enum/Server/App/EWeekDay';
import { useIndexContext } from '@/script/Pages/AttendanceEdit/Index';
import { DateTime } from '@/script/Common/DateTime';
import { IDate } from '@/script/Pages/AttendanceEdit/MonthCalendar/IDate';
import { IEvent } from '@/script/Pages/AttendanceEdit/MonthCalendar/IEvent';
import { getShortLabelAttendanceState } from '@/script/Enum/Server/App/EAttendanceState';
import { DateCell } from '@/script/Pages/AttendanceEdit/MonthCalendar/DateCell';
import { DialogEdit } from '@/script/Pages/AttendanceEdit/DialogEdit';
import { Closable } from '@/script/Component/Misc/Closable';

interface IProps extends IPropsBase {}
export const DateArea: React.FC<IProps> = ({ sx }) => {
  const { trnAttendanceStateList } = useIndexContext();
  const dateTime = DateTime.parseString(useIndexContext().dateTime);
  const [editDate, setEditDate] = React.useState<IDate | undefined>(undefined);

  // イベントリストを得る.
  const eventList: IEvent[] = useMemo(() => {
    return trnAttendanceStateList.list().map(attendance => {
      const time = DateTime.parseString(attendance.updatedAt).toHHMM();
      const action = getShortLabelAttendanceState(attendance.eAttendanceState);
      return {
        uid: attendance.id,
        start: DateTime.parseString(attendance.updatedAt),
        eAttendanceState: attendance.eAttendanceState,
        label: `${time} ${action}`,
        createdAt: DateTime.parseString(attendance.createdAt),
        updatedAt: DateTime.parseString(attendance.updatedAt),
      };
    });
  }, [trnAttendanceStateList]);

  /**
   * カレンダーに表示する日付のリスト.
   */
  const dateList = useMemo(() => {
    const ret: IDate[][] = [];

    const targetDateList: IDate[] = [];

    // 一週間の曜日の数.
    const DAYS_IN_WEEK = Object.values(E_WEEK_DAY).length;

    // 月初の日付を取得
    const startOfMonth = dateTime.startOfMonth();
    const endOfMonth = dateTime.endOfMonth();

    // 月の日の数を得る...A
    const daysInMonth = dateTime.daysInMonth();

    // 月初のweekを取得、weekの数だけ前の日が必要...B.
    const daysInBefore = startOfMonth.getWeekDay();

    // (A+B) % DAYS_IN_WEEKだけ後の日が必要...C
    const mod = DAYS_IN_WEEK - ((daysInBefore + daysInMonth) % DAYS_IN_WEEK);
    const daysInAfter = mod === DAYS_IN_WEEK ? 0 : mod;

    // A,B,Cをリストに全て含める
    const dayNum = daysInBefore + daysInMonth + daysInAfter;
    const firstDate = startOfMonth.subDay(daysInBefore);
    for (let i = 0; i < dayNum; ++i) {
      // 対象日付の取得.
      const targetDate = firstDate.addDay(i);

      // 対象の日付に相当するイベントだけ取得する.
      const targetEventList = eventList.filter(event =>
        event.start.isSameDay(targetDate),
      );

      // 日付セル配列に格納する.
      targetDateList.push({
        dateTime: targetDate,
        inRange: targetDate.inRange(startOfMonth, endOfMonth),
        eventList: targetEventList,
      });
    }

    // 取得した日付をDAYS_IN_WEEK日づつ分割する.
    while (targetDateList.length > 0) {
      ret.push(targetDateList.splice(0, DAYS_IN_WEEK));
    }

    return ret;
  }, [dateTime, eventList]);

  /**
   * 日付が選択された.
   */
  const handleSelect = (date: IDate) => {
    if (!date.inRange) {
      return;
    }
    setEditDate(date);
  };

  /**
   * ダイアログが閉じられた.
   */
  const handleClose = () => {
    setEditDate(undefined);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, calc(100% / 7))',
        borderRight: `1px solid ${E_COLOR.GREY}`,
        ...sx,
      }}
    >
      <Closable open={!!editDate}>
        <DialogEdit
          open={!!editDate}
          date={editDate}
          handleClose={handleClose}
        />
      </Closable>
      {dateList.map(week => {
        return (
          <Box
            key={week[0].dateTime.toJsTimeStamp()}
            sx={{
              display: 'contents',
            }}
          >
            {week.map(date => {
              return (
                <DateCell
                  key={date.dateTime.toJsTimeStamp()}
                  date={date}
                  handleSelect={handleSelect}
                />
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};
