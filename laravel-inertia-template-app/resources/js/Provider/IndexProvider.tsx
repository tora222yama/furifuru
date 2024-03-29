import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { IPropsBase } from '@/js/System/System';
import { themeCommon } from '@/js/System/Theme';

const client = new ApolloClient({
  ssrMode: true,
  uri: '/graphql',
  cache: new InMemoryCache(),
});

interface IProps extends IPropsBase {}
export const IndexProvider: React.FC<IProps> = ({ children }) => {
  return (
    <ThemeProvider theme={themeCommon}>
      <ApolloProvider client={client}>
        <CssBaseline />
        {children}
      </ApolloProvider>
    </ThemeProvider>
  );
};
