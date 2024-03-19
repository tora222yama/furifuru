import * as React from 'react';
import { AppBar as MuiAppBar } from '@mui/material';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {}
export const AppBar: React.FC<IProps> = () => {
  return (
    <MuiAppBar
      sx={{
        height: '56px',
        width: 'calc(100% - 250px)',
      }}
      position="fixed"
    >
      AppBar
    </MuiAppBar>
  );
};
