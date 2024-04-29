import * as React from 'react';
import { Box, Container } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { AppBarDesktop } from '@/script/Component/AppBar/AppBarDesktop';
import { DrawerDesktop } from '@/script/Component/Drawer/DrawerDesktop';

interface IProps extends IPropsBase {}
export const Page: React.FC<IProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <AppBarDesktop />
      <DrawerDesktop />
      <Container
        sx={{
          marginTop: theme => theme.mixins.toolbar.height,
          paddingLeft: theme => theme.mixins.drawer?.width,
          minWidth: theme => theme.breakpoints.values.md,
        }}
        maxWidth={false}
        disableGutters
      >
        {children}
      </Container>
    </Box>
  );
};
