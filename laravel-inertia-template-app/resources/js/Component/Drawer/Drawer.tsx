import * as React from 'react';
import { Drawer as MuiDrawer } from '@mui/material';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {}
export const Drawer: React.FC<IProps> = () => {
  return (
    <MuiDrawer
      sx={{
        width: '250px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '250px',
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      ここにdrawerを表示
    </MuiDrawer>
  );
};
