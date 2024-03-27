import * as React from 'react';
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {}
export const Drawer: React.FC<IProps> = () => {
  /**
   * 仮処理
   */
  const handleClickLogo = () => {
    window.location.href = '/dashboard';
  };

  /**
   * 仮処理.
   */
  const handleClickSlack = () => {
    // 仮でテストページに移動
    window.location.href = '/slack_log';
  };

  return (
    <MuiDrawer
      sx={{
        width: theme => theme.mixins.drawer?.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme => theme.mixins.drawer?.width,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box
        sx={{
          padding: '20px',
        }}
      >
        <Box
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleClickLogo}
        >
          <Typography>Laravel-Inertia-Template</Typography>
        </Box>
        <List>
          <ListItem key={1} disablePadding>
            <ListItemButton>
              <ListItemText>List1</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={2} disablePadding>
            <ListItemButton>
              <ListItemText>List2</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={3} disablePadding>
            <ListItemButton onClick={handleClickSlack}>
              <ListItemText>Slack通知・Log出力</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </MuiDrawer>
  );
};
