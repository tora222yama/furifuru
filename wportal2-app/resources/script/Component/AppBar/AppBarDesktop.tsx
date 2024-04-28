import * as React from 'react';
import { AppBar as MuiAppBar, Box, Toolbar } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Logo } from '@/script/Component/AppBar/Logo';

interface IProps extends IPropsBase {}
export const AppBarDesktop: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        height: theme => theme.mixins.toolbar.height,
      }}
      position="fixed"
    >
      <Toolbar
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px 20px',
          display: 'flex',
        }}
        disableGutters
      >
        <Logo
          sx={{
            marginRight: 'auto',
          }}
        />
        <Box>通貨</Box>
        <Box>ユーザー</Box>
      </Toolbar>
    </MuiAppBar>
  );
};
