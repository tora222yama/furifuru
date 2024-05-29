import * as React from 'react';
import { Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useIndexContext } from '@/script/Pages/Attendance/Index';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { E_WORKING_STATE } from '@/script/Enum/Server/App/EWorkingState';
import { MyselfNone } from '@/script/Pages/Attendance/Myself/MyselfNone';
import { MyselfWorking } from '@/script/Pages/Attendance/Myself/MyselfWorking';

interface IProps extends IPropsBase {}
export const Myself: React.FC<IProps> = ({ sx }) => {
  const { authUser } = useCommonIndexContext();
  const { trnAttendanceState } = useIndexContext();
  const lastWorkingState = trnAttendanceState.lastWorkingState(
    authUser.trnUser?.id,
  );

  /**
   * 現在のステータスを勤務状態で切り分け.
   */
  const nodeState = (): React.ReactNode => {
    switch (lastWorkingState) {
      case E_WORKING_STATE.NONE:
        return <MyselfNone />;
      case E_WORKING_STATE.WORKING:
        return <MyselfWorking />;
      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        padding: '20px',
        ...sx,
      }}
    >
      {nodeState()}
    </Paper>
  );
};
