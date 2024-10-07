import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { DateTime } from '@/script/Common/DateTime';

export interface IScheduleBlock {
  index: number;
  start: DateTime;
  end: DateTime;
}

interface IProps extends IPropsBase {
  date: DateTime;
  handleSelect: (block: IScheduleBlock) => void;
}
export const ScheduleDate: React.FC<IProps> = ({ sx, date, handleSelect }) => {
  const height = 100;

  /**
   * 11:00～14:00の間を30分間隔で1hづつ
   */
  const scheduleBlockList: IScheduleBlock[] = React.useMemo(() => {
    const ret = [];

    // 5個のブロックを作成.
    for (let i = 0; i < 5; ++i) {
      const offset = date.setHour(11).addMinute(i * 30);
      ret.push({
        index: i,
        start: offset,
        end: offset.addHour(),
      });
    }

    return ret;
  }, [date]);

  /**
   * スケジュールが選択された.
   * @param block
   */
  const handleSelectBlock = (block: IScheduleBlock) => {
    // TODO: 選択可能かなどチェック.
    handleSelect(block);
  };

  /**
   * 各1hのブロック.
   * @param block
   */
  const nodeHourBlock = (block: IScheduleBlock): React.ReactNode => {
    return (
      <Box
        key={block.index}
        sx={{
          borderTop: '1px solid #000',
          height: '100px',
          position: 'absolute',
          width: '100%',
          top: `${(height / 2) * block.index}px`,

          '&:hover': {
            backgroundColor: 'red',
          },
        }}
        onClick={() => handleSelectBlock(block)}
      >
        {block.start.toHHMM()}-{block.end.toHHMM()}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        borderTop: `1px solid ${E_COLOR.GREY}`,
        borderLeft: `1px solid ${E_COLOR.GREY}`,
        height: `${((scheduleBlockList.length - 1) * height) / 2 + height}px`,
        position: 'relative',
        ...sx,
      }}
    >
      {scheduleBlockList.map(block => {
        return nodeHourBlock(block);
      })}
    </Box>
  );
};
