import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeCommon } from '@/js/System/Theme';
export const IndexProvider = ({ children }) => {
    return (<React.Fragment>
      <ThemeProvider theme={themeCommon}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </React.Fragment>);
};
//# sourceMappingURL=IndexProvider.jsx.map