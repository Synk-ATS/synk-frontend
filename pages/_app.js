import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={SynkTheme}>
        <Component {...pageProps} />
      </BaseProvider>
    </StyletronProvider>
  );
}

export default MyApp;
