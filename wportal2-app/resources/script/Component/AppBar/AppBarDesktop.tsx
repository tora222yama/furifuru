import * as React from 'react';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { IPropsBase } from '@/script/System/System';

interface IProps extends IPropsBase {}
export const AppBarDesktop: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        left: theme => theme.mixins.drawer?.width,
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
        デスクトップ版AppBar
      </Toolbar>
    </MuiAppBar>
  );
};
