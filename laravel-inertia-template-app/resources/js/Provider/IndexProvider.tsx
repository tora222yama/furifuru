import * as React from 'react';
import {IPropsBase} from "@/js/System/System";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {themeCommon} from "@/js/System/Theme";

interface IProps extends IPropsBase {}
export const IndexProvider: React.FC<IProps> = ({ children }) => {
  return (
    <React.Fragment>
      <ThemeProvider theme={themeCommon}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </React.Fragment>
  )
}
