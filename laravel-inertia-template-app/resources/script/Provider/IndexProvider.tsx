import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { themeCommon } from '@/script/System/Theme';
import { IAuthUser } from '@/script/Models/App/Auth/AuthUser';

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
  authUser: IAuthUser;
};
export const context = React.createContext<IndexContext>({
  csrfToken: '',
  authUser: {
    id: 0,
    name: '',
    email: '',
  },
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {}
export const IndexProvider: React.FC<IProps> = ({
  csrfToken,
  authUser,
  children,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      csrfToken: csrfToken ?? '',
      authUser: {
        id: authUser.id ? Number(authUser.id) : 0,
        name: authUser.name ? String(authUser.name) : '',
        email: authUser.email ? String(authUser.email) : '',
      },
    }),
    [csrfToken, authUser],
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
