import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import store from '../redux/store';
import { useApollo } from '../lib/apollo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { initialApolloState } = pageProps;
  const client = useApollo(initialApolloState);
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <StyletronProvider value={styletron}>
            <BaseProvider theme={SynkTheme}>
              <Component {...pageProps} />
            </BaseProvider>
          </StyletronProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

// MyApp.getInitialProps = async (context) => {
//   const appProps = await App.getInitialProps(context);
// };
