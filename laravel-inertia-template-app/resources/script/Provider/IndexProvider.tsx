import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { themeCommon } from '@/script/System/Theme';

const client = new ApolloClient({
  ssrMode: true,
  uri: '/graphql',
  cache: new InMemoryCache(),
});

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  csrfToken: string;
};
export const context = React.createContext<IndexContext>({
  csrfToken: '',
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {}
export const IndexProvider: React.FC<IProps> = ({ csrfToken, children }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      csrfToken: csrfToken ?? '',
    }),
    [csrfToken],
  );

  return (
    <context.Provider value={providerValue}>
      <ThemeProvider theme={themeCommon}>
        <ApolloProvider client={client}>
          <CssBaseline />
          {children}
        </ApolloProvider>
      </ThemeProvider>
    </context.Provider>
  );
};
