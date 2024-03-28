import * as React from 'react';
import { Box, Container } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { AppBarDesktop } from '@/js/Component/AppBar/AppBarDesktop';
import { DrawerDesktop } from '@/js/Component/Drawer/DrawerDesktop';
import { DisplayDesktop } from '@/js/Component/Misc/DisplayDesktop';
import { DisplayMobile } from '@/js/Component/Misc/DisplayMobile';
import { AppBarMobile } from '@/js/Component/AppBar/AppBarMobile';

interface IProps extends IPropsBase {}
export const Page: React.FC<IProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        ...sx,
      }}
    >
      <DisplayDesktop>
        <AppBarDesktop />
        <DrawerDesktop />
      </DisplayDesktop>
      <DisplayMobile>
        <AppBarMobile />
      </DisplayMobile>
      <Container
        sx={{
          marginTop: theme => theme.mixins.toolbar.height,
          minWidth: theme => theme.breakpoints.values.sm,
        }}
        disableGutters
      >
        {children}
      </Container>
    </Box>
  );
};
