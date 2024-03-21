import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { AppBar } from '@/js/Component/AppBar/AppBar';
import { Drawer } from '@/js/Component/Drawer/Drawer';

interface IProps extends IPropsBase {}
export const Page: React.FC<IProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        ...sx,
      }}
    >
      <AppBar />
      <Drawer />
      <Box
        sx={{
          marginTop: theme => theme.mixins.toolbar.height,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
