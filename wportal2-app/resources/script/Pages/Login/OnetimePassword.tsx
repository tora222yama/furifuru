import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';

interface IProps extends IPropsBase {}
export const OnetimePassword: React.FC<IProps> = () => {
  return (
    <Box
      sx={{
        backgroundColor: E_COLOR.GREY_LIGHT,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}
    >
      <Paper
        sx={{
          padding: '20px',
          width: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TypoH2>ワンタイムパスワードの入力</TypoH2>
      </Paper>
    </Box>
  );
};
