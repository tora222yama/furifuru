import * as React from 'react';
import { Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';
import { TypoH1 } from '@/js/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/js/Enum/Server/App/EPages';

interface IPros extends IPropsBase {}
export const SlackLog: React.FC<IPros> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.SLACK_LOG)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        （SlackAppのenv設定が有効であれば）通知をSlackへ送信
      </Paper>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        envで設定されている標準ログに出力を実施
      </Paper>
    </Page>
  );
};
