import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { useIndexContext } from '@/script/Pages/Attendance/Index';
import { E_WORKING_STATE } from '@/script/Enum/Server/App/EWorkingState';
import { ActionNone } from '@/script/Pages/Attendance/Action/ActionNone';
import { EAttendanceState } from '@/script/Enum/Server/App/EAttendanceState';
import { useMutationAppAttendanceStateCreate } from '@/script/Hooks/App/Mutations/useMutationAppAttendanceStateCreate';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

interface IProps extends IPropsBase {}
export const Action: React.FC<IProps> = ({ sx }) => {
  const { onStart, onFinish } = useProgressContext();
  const { authUser } = useCommonIndexContext();
  const { trnAttendanceState } = useIndexContext();
  const lastWorkingState = trnAttendanceState.lastWorkingState(
    authUser.trnUser?.id,
  );
  const [, mutationAttendanceStateCreate] =
    useMutationAppAttendanceStateCreate();

  /**
   * いずれかのボタンを押されたとき.
   */
  const handleClick = (attendance: EAttendanceState) => {
    // 更新処理の実施.
    onStart();
    mutationAttendanceStateCreate(
      {
        eAttendanceState: attendance,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          router.reload({
            preserveScroll: true,
            preserveState: true,
            onStart,
            onFinish,
          });
          break;
        default:
          onFinish();
          break;
      }
    });
  };

  /**
   * 現在のステータスでボタンを切り分け.
   */
  const nodeButtons = (): React.ReactNode => {
    switch (lastWorkingState) {
      case E_WORKING_STATE.NONE:
        return <ActionNone handleClick={handleClick} />;
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
      <Box>{nodeButtons()}</Box>
    </Paper>
  );
};
