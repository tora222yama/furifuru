import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { IUsecasesCalendarUserSchedule } from '@/script/Models/Usecases/UsecasesCalendarUserScheduleList';
import {
  ColorTable,
  IScheduleBlock,
  ScheduleDateArea,
} from '@/script/Pages/Common/Dialog/DialogCalendarUseScheduleSelect/ScheduleDateArea';

interface IProps extends IPropsBase {
  dateList: DateTime[];
  scheduleList: IUsecasesCalendarUserSchedule[];
  colorTable: ColorTable;
  handleSelect: (block: IScheduleBlock) => void;
}
export const Schedule: React.FC<IProps> = ({
  sx,
  dateList,
  scheduleList,
  colorTable,
  handleSelect,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: E_COLOR.WHITE,
        display: 'flex',
        borderRight: `1px solid ${E_COLOR.GREY}`,
        borderBottom: `1px solid ${E_COLOR.GREY}`,
        ...sx,
      }}
    >
      {dateList.map(date => {
        return (
          <ScheduleDateArea
            key={date.getWeekDay()}
            sx={{
              width: '200px',
            }}
            date={date}
            scheduleList={scheduleList.filter(schedule =>
              date.isSameDay(DateTime.parseString(schedule.start)),
            )}
            colorTable={colorTable}
            handleSelect={handleSelect}
          />
        );
      })}
    </Box>
  );
};
