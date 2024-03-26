import * as React from 'react';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {}
export const AppBar: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        width: 'calc(100% - 250px)',
      }}
      position="fixed"
    >
      <Toolbar
        sx={{
          padding: '5px',
        }}
        disableGutters
      >
        AppBar
      </Toolbar>
    </MuiAppBar>
  );
};
