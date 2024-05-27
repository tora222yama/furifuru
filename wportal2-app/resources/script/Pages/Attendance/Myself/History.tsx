import * as React from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { useIndexContext } from '@/script/Pages/Attendance/Index';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';
import { getLabelAttendanceState } from '@/script/Enum/Server/App/EAttendanceState';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { DialogYesNo } from '@/script/Component/Misc/DialogYesNo';
import { Closable } from '@/script/Component/Misc/Closable';
import { Log } from '@/script/Common/Log';

interface IProps extends IPropsBase {}
export const History: React.FC<IProps> = ({ sx }) => {
  const { authUser } = useCommonIndexContext();
  const { trnAttendanceState } = useIndexContext();
  const list = trnAttendanceState.listByTrnUserId(authUser.trnUser?.id);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

  /**
   * 勤怠履歴を一つ削除する.
   */
  const handleDeleteAttendance = () => {
    Log.info('勤怠履歴を一つ削除する.');
  };

  return (
    <>
      <Closable open={openConfirm}>
        <DialogYesNo
          open={openConfirm}
          labels={{
            content: '勤怠の履歴を１つ削除しますか？',
          }}
          actions={{
            submit: handleDeleteAttendance,
            close: () => setOpenConfirm(false),
          }}
        />
      </Closable>
      <Box
        sx={{
          width: '100%',
          height: '100px',
          padding: '0 20px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...sx,
        }}
      >
        <Stepper
          sx={{ width: '100%' }}
          activeStep={list.length}
          alternativeLabel
        >
          {list.map(trnAttendanceState => {
            return (
              <Step
                key={trnAttendanceState.id}
                sx={{
                  '& .MuiStepConnector-line': {
                    borderColor: E_COLOR.PRIMARY_DARK,
                  },
                }}
              >
                <StepLabel>
                  <TypoText>
                    {DateTime.parseString(
                      trnAttendanceState.updatedAt,
                    ).toHHMM()}
                  </TypoText>
                  <TypoText>
                    {getLabelAttendanceState(
                      trnAttendanceState.eAttendanceState,
                    )}
                  </TypoText>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px',
        }}
      >
        <ButtonGeneral
          sx={{ width: 'fit-content' }}
          label="直近の勤怠を取消"
          variant="outlined"
          onClick={() => setOpenConfirm(true)}
        />
        <TypoText>＞時刻修正</TypoText>
      </Box>
    </>
  );
};
