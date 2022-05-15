import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import styletron from '../lib/styletron';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider>
        <Component {...pageProps} />
      </BaseProvider>
    </StyletronProvider>
  );
}

export default MyApp;
