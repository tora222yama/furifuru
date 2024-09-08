import * as React from 'react';
import { Box, styled } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSize } from '@/script/System/Responsive';
import { IAppTrnUserReward } from '@/script/Models/App/Trn/TrnUserRewardList';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';

const StyledImage = styled('img')({});

interface IProps extends IPropsBase {
  trnUserReward: IAppTrnUserReward;
}
export const AchievementImage: React.FC<IProps> = ({ sx, trnUserReward }) => {
  const fileId = `000${trnUserReward.mstRewardId}`.slice(-4);

  /**
   * ランク表示.
   */
  const nodeRank: React.ReactNode[] = [];
  const rank = trnUserReward.mstReward?.rewardRank ?? 0;
  for (let i = 0; i < rank; i++) {
    nodeRank.push(<Icon key={`rank_${i}`} icon={E_ICON.STAR} />);
  }

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Box
        sx={{
          width: responsiveSize(100),
          height: responsiveSize(100),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid',
        }}
      >
        <StyledImage
          sx={{
            width: responsiveSize(80),
            height: responsiveSize(80),
          }}
          src={`/image/reward/reward${fileId}.png`}
        />
      </Box>
      <Box>{nodeRank}</Box>
    </Box>
  );
};
