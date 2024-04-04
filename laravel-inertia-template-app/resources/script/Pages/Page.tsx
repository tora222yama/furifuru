import * as React from 'react';
import { Box, Container } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { AppBarDesktop } from '@/script/Component/AppBar/AppBarDesktop';
import { DrawerDesktop } from '@/script/Component/Drawer/DrawerDesktop';
import { DisplayDesktop } from '@/script/Component/Misc/DisplayDesktop';
import { DisplayMobile } from '@/script/Component/Misc/DisplayMobile';
import { AppBarMobile } from '@/script/Component/AppBar/AppBarMobile';

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
