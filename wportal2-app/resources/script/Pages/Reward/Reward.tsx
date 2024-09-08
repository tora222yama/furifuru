import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { responsiveSpacing } from '@/script/System/Responsive';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { AchievementList } from '@/script/Pages/Reward/AchievementList';
import { useIndexContext } from '@/script/Pages/Reward/Index';
import { Closable } from '@/script/Component/Misc/Closable';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { RewardGold } from '@/script/Pages/Reward/RewardGold';
import { DialogYesNo } from '@/script/Component/Misc/DialogYesNo';

interface IProps extends IPropsBase {}
export const Reward: React.FC<IProps> = () => {
  const { trnUserRewardList } = useIndexContext();
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

  /**
   * 獲得処理の実行.
   */
  const handleSubmitArchive = () => {
    // TODO: 送信処理.
  };

  return (
    <Page>
      <DialogYesNo
        open={openConfirm}
        labels={{
          content: '獲得できる報酬を一括で獲得しますか？',
        }}
        actions={{
          submit: handleSubmitArchive,
          close: () => setOpenConfirm(false),
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.REWARD)}</TypoH1>
      </Box>
      <Closable open={trnUserRewardList.hasAchievableReward()}>
        <Paper
          sx={{
            marginTop: responsiveSpacing(4),
            padding: responsiveSpacing(4),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box>
            <TypoH2>獲得できる報酬があります</TypoH2>
            <Box
              sx={{
                marginTop: responsiveSpacing(2),
              }}
            >
              <RewardGold gold={trnUserRewardList.totalAchievableGold()} />
            </Box>
          </Box>
          <ButtonGeneral
            sx={{
              marginLeft: 'auto',
            }}
            label="一括獲得"
            onClick={() => setOpenConfirm(true)}
          />
        </Paper>
      </Closable>
      <Box
        sx={{
          marginTop: responsiveSpacing(4),
        }}
      >
        <TypoText align="right" sx={{ marginLeft: 'auto' }}>
          報酬リストへのリンク.
        </TypoText>
      </Box>
      <AchievementList />
    </Page>
  );
};
