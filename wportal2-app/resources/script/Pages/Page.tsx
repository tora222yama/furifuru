import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { AppBarDesktop } from '@/script/Component/AppBar/AppBarDesktop';
import { DrawerDesktop } from '@/script/Component/Drawer/DrawerDesktop';

interface IProps extends IPropsBase {}
export const Page: React.FC<IProps> = ({ sx }) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <AppBarDesktop />
      <DrawerDesktop />
    </Box>
  );
};
