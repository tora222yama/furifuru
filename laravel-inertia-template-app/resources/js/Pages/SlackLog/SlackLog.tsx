import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';

interface IPros extends IPropsBase {}
export const SlackLog: React.FC<IPros> = () => {
  return (
    <Page>
      <Box
        sx={{
          height: '1200px',
          padding: '20px',
        }}
      >
        <Paper
          sx={{
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
      </Box>
    </Page>
  );
};
