import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { themeCommon } from '@/script/System/Theme';
import { ProgressProvider } from '@/script/Provider/ProgressProvider';
import {
  getDefaultLocation,
  ILocation,
  parseLocation,
} from '@/script/Provider/ILocation';
import {
  AppTrnUserList,
  IAppTrnUser,
  parseAppTrnUserPayload,
} from '@/script/Models/App/Trn/TrnUserList';

const client = new ApolloClient({
  ssrMode: true,
  uri: '/graphql',
  cache: new InMemoryCache(),
});

/**
 * コントローラーからグローバルに受取保持する値.
 */
type CommonIndexContext = {
  csrfToken: string;
  trnUser: IAppTrnUser;
  location: ILocation;
};
export const context = React.createContext<CommonIndexContext>({
  csrfToken: '',
  trnUser: AppTrnUserList.defaultInterface(),
  location: getDefaultLocation(),
});
export const useCommonIndexContext = (): CommonIndexContext =>
  useContext(context);

interface IProps extends IPropsBase {}
export const CommonIndexProvider: React.FC<IProps> = ({
  csrfToken,
  trnUser,
  location,
  children,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: CommonIndexContext = useMemo(
    () => ({
      csrfToken: csrfToken ?? '',
      trnUser: parseAppTrnUserPayload(trnUser),
      location: parseLocation(location),
    }),
    [csrfToken, trnUser, location],
  );

  return (
    <context.Provider value={providerValue}>
      <ThemeProvider theme={themeCommon}>
        <ApolloProvider client={client}>
          <ProgressProvider>
            <CssBaseline />
            {children}
          </ProgressProvider>
        </ApolloProvider>
      </ThemeProvider>
    </context.Provider>
  );
};
