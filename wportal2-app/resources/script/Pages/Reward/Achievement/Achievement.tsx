import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUserReward } from '@/script/Models/App/Trn/TrnUserRewardList';
import { E_COLOR } from '@/script/Enum/EColor';
import { responsiveSize, responsiveSpacing } from '@/script/System/Responsive';
import { RewardGold } from '@/script/Pages/Reward/RewardGold';
import { AchievementTitle } from '@/script/Pages/Reward/Achievement/AchievementTitle';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { TypoText2 } from '@/script/Component/Typography/TypoText2';
import { AchievementImage } from '@/script/Pages/Reward/Achievement/AchievementImage';

interface IProps extends IPropsBase {
  trnUserReward: IAppTrnUserReward;
}
export const Achievement: React.FC<IProps> = ({ sx, trnUserReward }) => {
  const enableReceiveCount = Math.max(
    trnUserReward.achievementCount - trnUserReward.receivedCount,
  );

  return (
    <Box
      sx={{
        ...sx,
        border: `1px solid ${E_COLOR.GREY}`,
        display: 'flex',
        padding: responsiveSpacing(2),
        alignItems: 'stretch',
        gap: responsiveSpacing(2),
      }}
    >
      <AchievementImage trnUserReward={trnUserReward} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AchievementTitle trnUserReward={trnUserReward} />
        <TypoText2
          sx={{
            whiteSpace: 'pre-wrap',
            marginBottom: responsiveSpacing(2),
          }}
        >
          {trnUserReward.mstReward?.rewardExplain}
        </TypoText2>
        <Box
          sx={{
            marginTop: 'auto',
          }}
        >
          <RewardGold mstReward={trnUserReward.mstReward} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ButtonGeneral
          sx={{
            py: responsiveSize(6),
            px: responsiveSize(4),
            minWidth: 0,
          }}
          label={`${enableReceiveCount}回受取`}
        />
      </Box>
    </Box>
  );
};
