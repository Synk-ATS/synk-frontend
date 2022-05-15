import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import store from '../redux/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyletronProvider value={styletron}>
          <BaseProvider theme={SynkTheme}>
            <Component {...pageProps} />
          </BaseProvider>
        </StyletronProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

// MyApp.getInitialProps = async (context) => {
//   const appProps = await App.getInitialProps(context);
// };
