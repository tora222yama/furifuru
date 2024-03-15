import * as React from 'react';
import {Box, Button, CssBaseline, Paper, ThemeProvider} from "@mui/material";
import { themeCommon } from "@/js/System/Theme";
import {useContext, useMemo} from "react";
import {IPropsBase} from "@/js/System/System";
import {FirstPage} from "@/js/Pages/FirstPage/FirstPage";

type FirstPageContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
}
export const context = React.createContext<FirstPageContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],
});
export const useFirstPageContext = (): FirstPageContext => useContext(context);

interface IPros extends IPropsBase {
  numberValue: number,
  stringValue: string,
  arrayValue: number[],
}
export const FirstPageIndex: React.FC<IPros> = ({ numberValue, stringValue, arrayValue }) => {

  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: FirstPageContext = useMemo(() => ({
    numberValue,
    stringValue,
    arrayValue
  }), [ numberValue, stringValue, arrayValue]);

  return (
    <context.Provider value={providerValue}>
      <FirstPage />
    </context.Provider>
  )
}
export default FirstPageIndex;
