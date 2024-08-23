import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { CardLogin } from '@/script/Pages/Login/CardLogin';
import { LegacyLogin } from '@/script/Pages/Login/LegacyLogin';

interface IProps extends IPropsBase {}
export const Login: React.FC<IProps> = () => {
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
      <CardLogin />
      <LegacyLogin />
    </Box>
  );
};
