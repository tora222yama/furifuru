import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import {
  IScheduleBlock,
  ScheduleDate,
} from '@/script/Pages/Common/Dialog/DialogCalendarUseScheduleSelect/ScheduleDate';
import { DateTime } from '@/script/Common/DateTime';

interface IProps extends IPropsBase {
  dateList: DateTime[];
  handleSelect: (block: IScheduleBlock) => void;
}
export const Schedule: React.FC<IProps> = ({ sx, dateList, handleSelect }) => {
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
          <ScheduleDate
            sx={{
              width: '200px',
            }}
            key={date.getWeekDay()}
            date={date}
            handleSelect={handleSelect}
          />
        );
      })}
    </Box>
  );
};
