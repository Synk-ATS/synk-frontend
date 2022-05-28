/* eslint-disable react/prop-types */

import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider, gql } from '@apollo/client';
import App from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import synkStore from '../redux/store';
import { initializeApollo, useApollo } from '../lib/apollo';
import Loading from '../components/atoms/loading';
import { getProfile } from '../redux/slices/global.slice';
import '../styles/globals.css';
import 'normalize.css';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const {
    initialApolloState, initialReduxState, session, initString,
  } = pageProps;
  const client = useApollo(initialApolloState);
  const _store = synkStore(initialReduxState);
  const persistor = persistStore(_store);
  const router = useRouter();

  console.log(initString);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.pathname) {
        setLoading(true);
      }

      setLoading(false);
    };

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Provider store={_store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <StyletronProvider value={styletron}>
              <BaseProvider theme={SynkTheme}>
                <Loading loading={loading} />
                {getLayout(<Component {...pageProps} />)}
              </BaseProvider>
            </StyletronProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);
  const _store = synkStore();
  const { dispatch } = _store;
  const session = await getSession(context);
  let initString;
  if (session) {
    const ref = doc(firestore, 'students', `${session.user.uid}`);

    const docSnap = await getDoc(ref);
    const student = docSnap.data();

    dispatch(getProfile(student), { payload: student });
  }

  return { ...appProps, pageProps: { initialReduxState: _store.getState(), initString } };
};
