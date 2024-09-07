import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { responsiveSpacing } from '@/script/System/Responsive';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { AchievementList } from '@/script/Pages/Reward/AchievementList';

interface IProps extends IPropsBase {}
export const Reward: React.FC<IProps> = () => {
  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.REWARD)}</TypoH1>
      </Box>
      <Box
        sx={{
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
          border: '1px solid #000',
        }}
      >
        未獲得要素があればここで一括獲得
      </Box>
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
