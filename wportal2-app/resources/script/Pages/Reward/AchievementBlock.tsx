import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUserReward } from '@/script/Models/App/Trn/TrnUserRewardList';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {
  trnUserReward: IAppTrnUserReward;
}
export const AchievementBlock: React.FC<IProps> = ({ sx, trnUserReward }) => {
  return (
    <Box
      sx={{
        ...sx,
        border: `1px solid ${E_COLOR.BLACK}`,
      }}
    >
      {trnUserReward.id}/{trnUserReward.mstRewardId}
    </Box>
  );
};
