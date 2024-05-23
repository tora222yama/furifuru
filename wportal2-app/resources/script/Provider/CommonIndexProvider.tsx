import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useContext, useMemo } from 'react';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { IPropsBase } from '@/script/System/System';
import { themeCommon } from '@/script/System/Theme';
import { ProgressProvider } from '@/script/Provider/ProgressProvider';
import {
  getDefaultLocation,
  ILocation,
  parseLocation,
} from '@/script/Provider/ILocation';
import {
  AppAuthUserList,
  IAppAuthUser,
  parseAppAuthUserPayload,
} from '@/script/Models/App/Auth/AuthUserList';

const link = createUploadLink({
  uri: '/graphql',
});

const client = new ApolloClient({
  ssrMode: false,
  cache: new InMemoryCache(),
  link,
});

/**
 * コントローラーからグローバルに受取保持する値.
 */
type CommonIndexContext = {
  csrfToken: string;
  authUser: IAppAuthUser;
  location: ILocation;
};
export const context = React.createContext<CommonIndexContext>({
  csrfToken: '',
  authUser: AppAuthUserList.defaultInterface(),
  location: getDefaultLocation(),
});
export const useCommonIndexContext = (): CommonIndexContext =>
  useContext(context);

interface IProps extends IPropsBase {}
export const CommonIndexProvider: React.FC<IProps> = ({
  csrfToken,
  authUser,
  location,
  children,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: CommonIndexContext = useMemo(
    () => ({
      csrfToken: csrfToken ?? '',
      authUser: parseAppAuthUserPayload(authUser),
      location: parseLocation(location),
    }),
    [csrfToken, authUser, location],
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
