import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeCommon } from '@/js/System/Theme';
export const IndexProvider = ({ children }) => {
    return (<ThemeProvider theme={themeCommon}>
      <CssBaseline />
      {children}
    </ThemeProvider>);
};
//# sourceMappingURL=IndexProvider.jsx.map