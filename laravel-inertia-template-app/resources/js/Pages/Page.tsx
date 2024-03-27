import * as React from 'react';
import { Box, Container } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { AppBar } from '@/js/Component/AppBar/AppBar';
import { Drawer } from '@/js/Component/Drawer/Drawer';
import { DisplayDesktop } from '@/js/Component/Misc/DisplayDesktop';
import { DisplayMobile } from '@/js/Component/Misc/DisplayMobile';

interface IProps extends IPropsBase {}
export const Page: React.FC<IProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        ...sx,
      }}
    >
      <DisplayDesktop>
        <AppBar />
        <Drawer />
      </DisplayDesktop>
      <DisplayMobile>
        <AppBar />
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
