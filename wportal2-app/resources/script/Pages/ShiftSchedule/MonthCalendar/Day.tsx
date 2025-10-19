import * as React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';
import { IDate } from '@/script/Hooks/useMonthCalendar';

interface IProps extends IPropsBase {
  date: IDate;
}
export const Day: React.FC<IProps> = ({ sx, date }) => {
  const dateColor = date.inRange ? E_COLOR.BLACK : E_COLOR.GREY;
  const [shift, setShift] = React.useState('');

  const handleChange = (event: any) => {
    setShift(event.target.value);
  };

  return (
    <Box
      sx={{
        padding: '6px',
        minHeight: '120px',
        borderTop: `1px solid ${E_COLOR.GREY}`,
        borderLeft: `1px solid ${E_COLOR.GREY}`,
        ...sx,
      }}
    >
      <TypoText color={dateColor} bold={date.inRange}>
        {date.dateTime.toFormatString('dd日')}
      </TypoText>
      {date.inRange && (
        <Select
          variant="outlined"
          value={shift}
          onChange={handleChange}
          displayEmpty
          fullWidth
          size="small"
          sx={{ marginTop: '8px' }}
        >
          <MenuItem value="">
            <em>未選択</em>
          </MenuItem>
          <MenuItem value={'office'}>出社</MenuItem>
          <MenuItem value={'remote'}>在宅</MenuItem>
          <MenuItem value={'holiday'}>休暇</MenuItem>
        </Select>
      )}
    </Box>
  );
};
