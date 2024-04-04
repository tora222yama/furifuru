import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';

interface IProps extends IPropsBase {}
export const Dashboard: React.FC<IProps> = () => {
  return (
    <Page>
      <Box
        sx={{
          height: '1200px',
          padding: '10px',
        }}
      >
        長いメッセージ長いメッセージ長いメッセージ長いメッセージ長いメッセージ
      </Box>
    </Page>
  );
};
