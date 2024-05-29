import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import {
  E_ATTENDANCE_STATE,
  EAttendanceState,
  getLabelAttendanceState,
} from '@/script/Enum/Server/App/EAttendanceState';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

interface IProps extends IPropsBase {
  handleClick: (state: EAttendanceState) => void;
}
export const ActionWorking: React.FC<IProps> = ({ sx, handleClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <ButtonGeneral
        sx={{ width: '200px' }}
        label={getLabelAttendanceState(E_ATTENDANCE_STATE.BEGIN_BREAK)}
        onClick={() => handleClick(E_ATTENDANCE_STATE.BEGIN_BREAK)}
      />
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column',
          rowGap: '20px',
        }}
      >
        <ButtonGeneral
          sx={{
            width: '200px',
          }}
          label={getLabelAttendanceState(E_ATTENDANCE_STATE.LEAVING)}
          onClick={() => handleClick(E_ATTENDANCE_STATE.LEAVING)}
        />
      </Box>
    </Box>
  );
};
