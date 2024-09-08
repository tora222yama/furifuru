import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUserReward } from '@/script/Models/App/Trn/TrnUserRewardList';
import { responsiveSpacing } from '@/script/System/Responsive';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {
  trnUserReward: IAppTrnUserReward;
}
export const AchievementTitle: React.FC<IProps> = ({ sx, trnUserReward }) => {
  return (
    <Box
      sx={{
        backgroundColor: E_COLOR.PRIMARY_LIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        gap: responsiveSpacing(2),
        ...sx,
      }}
    >
      <TypoText>{`No.${trnUserReward.mstRewardId}`}</TypoText>
      <TypoText>{trnUserReward.mstReward?.rewardName}</TypoText>
      <TypoText sx={{ marginLeft: 'auto' }} bold>
        {`[${trnUserReward.achievementCount}回達成]`}
      </TypoText>
    </Box>
  );
};
