import * as React from 'react';
import { AppBar as MuiAppBar, Toolbar } from '@mui/material';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {}
export const AppBar: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        left: theme => ({
          sm: '0px',
          md: theme.mixins.drawer?.width,
        }),
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
        AppBar
      </Toolbar>
    </MuiAppBar>
  );
};
