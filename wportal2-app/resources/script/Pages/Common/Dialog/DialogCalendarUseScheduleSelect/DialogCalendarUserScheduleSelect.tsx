import * as React from 'react';
import { Box, Dialog, Divider } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/script/Component/Typography/TypoSubTitle1';
import { useFetchAppCalendarUserScheduleList } from '@/script/Hooks/Usecases/Queries/useFetchAppCalendarUserScheduleList';
import { Loading } from '@/script/Component/Misc/Loading';
import { responsiveSpacing } from '@/script/System/Responsive';
import { DateTime } from '@/script/Common/DateTime';
import { Header } from '@/script/Pages/Common/Dialog/DialogCalendarUseScheduleSelect/Header';
import { Schedule } from '@/script/Pages/Common/Dialog/DialogCalendarUseScheduleSelect/Schedule';
import {
  ColorTable,
  IScheduleBlock,
} from '@/script/Pages/Common/Dialog/DialogCalendarUseScheduleSelect/ScheduleDateArea';
import { E_COLOR, EColor } from '@/script/Enum/EColor';

/**
 * 複数ユーザーのスケジュールから、空いている時間を選択するダイアログ.
 * ランチ向けに11:00～14:00の間のスケジュールを選択する.
 */
interface IProps extends IPropsBase {
  open: boolean;
  emailList: string[];
  handleClose: () => void;
}
export const DialogCalendarUserScheduleSelect: React.FC<IProps> = ({
  sx,
  open,
  emailList,
  handleClose,
}) => {
  const [startDate /* setStartDate */] = React.useState<DateTime>(
    DateTime.now().startOfWeek(),
  );
  const [endDate /* setEndDate */] = React.useState<DateTime>(
    DateTime.now().endOfWeek(),
  );
  const [loading, list] = useFetchAppCalendarUserScheduleList({
    emailList,
    startDate,
    endDate,
  });

  /**
   * emailListからカラーリストを作成する.
   */
  const colorTable: ColorTable = React.useMemo(() => {
    const ret: ColorTable = {};
    const colorTable: EColor[] = [E_COLOR.GREEN_LIGHT, E_COLOR.BLUE_LIGHT];

    emailList.forEach((email, index) => {
      ret[email] = colorTable[index % colorTable.length];
    });

    return ret;
  }, [emailList]);

  /**
   * 表示日付の成形.
   */
  const dateList: DateTime[] = React.useMemo(() => {
    const ret = [];
    const daySpan = startDate.getDateDiff(endDate) + 1;
    for (let i = 0; i < daySpan; ++i) {
      const date = startDate.addDay(i);
      ret.push(date);
    }
    return ret;
  }, [startDate, endDate]);

  /**
   * スケジュールを選択した.
   * @param block
   */
  const handleSelect = (block: IScheduleBlock) => {
    console.log(`${block.index}/${block.start.toDateTime()}が選択`);
  };

  return (
    <Dialog
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '90%',
          },
        },
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
        <TypoText>START:{startDate.toDateTime()}</TypoText>
        <TypoText>END:{endDate.toDateTime()}</TypoText>
        <Divider sx={{ width: '100%', my: responsiveSpacing(4) }} />
        <Loading loading={loading}>
          <Header dateList={dateList} />
          <Schedule
            dateList={dateList}
            scheduleList={list.list()}
            colorTable={colorTable}
            handleSelect={handleSelect}
          />
        </Loading>
      </Box>
    </Dialog>
  );
};
