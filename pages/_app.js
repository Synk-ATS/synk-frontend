/* eslint-disable react/prop-types */

import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import App from 'next/app';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import synkStore from '../redux/store';
import { useApollo } from '../lib/apollo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { initialApolloState, initialReduxState } = pageProps;
  const client = useApollo(initialApolloState);
  const _store = synkStore(initialReduxState);
  const persistor = persistStore(_store);

  return (
    <Provider store={_store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <StyletronProvider value={styletron}>
            <BaseProvider theme={SynkTheme}>
              {getLayout(<Component {...pageProps} />)}
            </BaseProvider>
          </StyletronProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);
  const _store = synkStore();

  return { ...appProps, pageProps: { initialReduxState: _store.getState() } };
};
