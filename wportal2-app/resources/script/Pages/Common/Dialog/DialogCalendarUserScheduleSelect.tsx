import * as React from 'react';
import { Box, Dialog, Divider } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/script/Component/Typography/TypoSubTitle1';
import { useFetchAppCalendarUserScheduleList } from '@/script/Hooks/Usecases/Queries/useFetchAppCalendarUserScheduleList';
import { Loading } from '@/script/Component/Misc/Loading';
import { responsiveSpacing } from '@/script/System/Responsive';

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
  const [loading] = useFetchAppCalendarUserScheduleList({
    emailList,
    startDate,
    endDate,
  });

  return (
    <Dialog
      sx={{
        ...sx,
      }}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          padding: responsiveSpacing(4),
        }}
      >
        <TypoSubTitle1>スケジュールを選択してください</TypoSubTitle1>
        <Divider sx={{ width: '100%', my: responsiveSpacing(4) }} />
        <Loading loading={loading}>
          <TypoText>ダイアログの中身</TypoText>
        </Loading>
      </Box>
    </Dialog>
  );
};
