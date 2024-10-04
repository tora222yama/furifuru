import * as React from 'react';
import { Box, Dialog, Divider } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/script/Component/Typography/TypoSubTitle1';
import { useFetchAppCalendarUserScheduleList } from '@/script/Hooks/App/Queries/useFetchAppCalendarUserScheduleList';

/**
 * 複数ユーザーのスケジュールから、空いている時間を選択するダイアログ.
 */
interface IProps extends IPropsBase {
  open: boolean;
  emailList: string[];
  startDate: string;
  endDate: string;
  handleClose: () => void;
}
export const DialogCalendarUserScheduleSelect: React.FC<IProps> = ({
  sx,
  open,
  emailList,
  startDate,
  endDate,
  handleClose,
}) => {
  const [loading, test] = useFetchAppCalendarUserScheduleList({
    emailList,
    startDate,
    endDate,
  });
  console.log(loading);
  console.log(test);

  return (
    <Dialog
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '80vw',
            minWidth: '600px',
            maxWidth: '80vw',
          },
        },
        ...sx,
      }}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          padding: '20px',
        }}
      >
        <TypoSubTitle1>スケジュールを選択してください</TypoSubTitle1>
        <Divider sx={{ width: '100%' }} />
        <TypoText>ダイアログの中身</TypoText>
      </Box>
    </Dialog>
  );
};
