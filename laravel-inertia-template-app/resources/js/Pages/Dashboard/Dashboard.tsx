import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';

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
