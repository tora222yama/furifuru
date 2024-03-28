import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';
import { TypoH1 } from '@/js/Component/Typography/TypoH1';
import { TypoText } from '@/js/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/js/Component/Typography/TypoSubTitle1';
import { Log } from '@/js/Common/Log';
import { ButtonGeneral } from '@/js/Component/Button/ButtonGeneral';

interface IProps extends IPropsBase {}
export const Redis: React.FC<IProps> = () => {
  const [currentValue] = React.useState<string>('-');

  /**
   * Redisの値を取得.
   */
  const handleClickLoad = () => {
    Log.info('値を取得');
  };

  /**
   * Redisへ値を保存.
   */
  const handleClickSave = () => {
    Log.info('値を保存');
  };

  return (
    <Page>
      <TypoH1>Redis/GraphQLサンプル</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoSubTitle1>現在のRedisに保持している値を取得</TypoSubTitle1>
        <Box
          sx={{
            backgroundColor: 'primary.light',
            marginTop: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TypoText>現在の値</TypoText>
          <TypoText
            sx={{
              marginLeft: '20px',
            }}
          >
            {currentValue}
          </TypoText>
        </Box>
        <ButtonGeneral
          sx={{
            marginTop: '20px',
          }}
          onClick={handleClickLoad}
        >
          <TypoText>取得</TypoText>
        </ButtonGeneral>
      </Paper>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoSubTitle1>入力した値をRedisに保存</TypoSubTitle1>
        <ButtonGeneral
          sx={{
            marginTop: '20px',
          }}
          onClick={handleClickSave}
        >
          <TypoText>保存</TypoText>
        </ButtonGeneral>
      </Paper>
    </Page>
  );
};
