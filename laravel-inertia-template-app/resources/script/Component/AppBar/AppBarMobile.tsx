import * as React from 'react';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { IPropsBase } from '@/script/System/System';

interface IProps extends IPropsBase {}
export const AppBarMobile: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        left: '0px',
      }}
      position="fixed"
    >
      <Toolbar
        sx={{
          width: '100%',
          padding: '5px',
        }}
        disableGutters
      >
        モバイル版AppBar
      </Toolbar>
    </MuiAppBar>
  );
};
