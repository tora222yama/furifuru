import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { themeCommon } from '@/js/System/Theme';

interface IProps extends IPropsBase {}
export const IndexProvider: React.FC<IProps> = ({ children }) => {
  return (
    <ThemeProvider theme={themeCommon}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
