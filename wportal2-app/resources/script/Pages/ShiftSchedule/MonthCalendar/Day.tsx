import * as React from 'react';
import { Box, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';
import { IDate } from '@/script/Common/getMonthCalendar';
import { ShiftType } from '@/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar';

interface IProps extends IPropsBase {
  date: IDate;
  shift: ShiftType;
  onShiftChange: (shift: ShiftType) => void;
}
export const Day: React.FC<IProps> = ({ sx, date, shift, onShiftChange }) => {
  const dateColor = date.inRange ? E_COLOR.BLACK : E_COLOR.GREY;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onShiftChange(event.target.value as ShiftType);
  };

  return (
    <Box
      sx={{
        padding: '6px',
        minHeight: '120px',
        borderTop: `1px solid ${E_COLOR.GREY}`,
        borderLeft: `1px solid ${E_COLOR.GREY}`,
        position: 'relative',
        ...sx,
        bgcolor:
          date.inRange && shift === 'holiday'
            ? E_COLOR.BACKGROUND_GRAYOUT
            : 'transparent',
      }}
    >
      <TypoText color={dateColor} bold={date.inRange}>
        {date.dateTime.toFormatString('dd日')}
      </TypoText>
      {date.inRange && (
        <RadioGroup
          value={shift}
          onChange={handleChange}
          sx={{ marginTop: '8px', position: 'relative' }}
        >
          <FormControlLabel
            value="remote"
            control={<Radio size="small" />}
            label={<TypoText size="xs">在宅</TypoText>}
          />
          <FormControlLabel
            value="office"
            control={<Radio size="small" />}
            label={<TypoText size="xs">出社</TypoText>}
          />
          <FormControlLabel
            value="businessTrip"
            control={<Radio size="small" />}
            label={<TypoText size="xs">出張</TypoText>}
          />
          <FormControlLabel
            value="holiday"
            control={<Radio size="small" />}
            label={<TypoText size="xs">休暇</TypoText>}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              margin: 0,
            }}
          />
        </RadioGroup>
      )}
    </Box>
  );
};
