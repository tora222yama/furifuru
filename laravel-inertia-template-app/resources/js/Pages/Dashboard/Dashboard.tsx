import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';

interface IPros extends IPropsBase {}
export const Dashboard: React.FC<IPros> = () => {
  return (
    <Page>
      <Box
        sx={{
          height: '1200px',
          padding: '10px',
        }}
      >
        dashboard.
      </Box>
    </Page>
  );
};
