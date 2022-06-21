/* eslint-disable react/prop-types */

import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import App from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import synkStore from '../redux/store';
import { useApollo } from '../lib/apollo';
import Loading from '../components/atoms/loading';
import { setProfile, setSignInType, USER_TYPE } from '../redux/slices/auth.slice';
import '../styles/globals.css';
import 'normalize.css';
import { AppFacultyQuery } from '../graphql/queries/faculty.query';
import { AppStudentQuery } from '../graphql/queries/student.query';
import { fetchAPI } from '../lib/api';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { initialApolloState, initialReduxState, session } = pageProps;
  const client = useApollo(initialApolloState);
  const _store = synkStore(initialReduxState);
  const persistor = persistStore(_store);
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.pathname) {
        setLoading(true);
      }
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
                {loading ? <Loading loading={loading} /> : null}
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

  const session = await getSession(context);

  if (session) {
    const { dispatch } = _store;
    const { jwt, user } = session;
    const { role } = user;

    let result;

    switch (role) {
      case 'faculty': {
        const { facultyID } = user;
        dispatch(setSignInType(USER_TYPE.faculty));
        const { data } = await fetchAPI({
          query: AppFacultyQuery, variables: { id: facultyID }, token: jwt,
        });

        result = { ...data.faculty.data };
        break;
      }
      case 'student': {
        const { studentID } = user;
        dispatch(setSignInType(USER_TYPE.student));
        const { data } = await fetchAPI({
          query: AppStudentQuery, variables: { id: studentID }, token: jwt,
        });
        result = { ...data.student.data };
        break;
      }
      default:
        return {};
    }
    dispatch(setProfile(result));
  }

  return { ...appProps, pageProps: { initialReduxState: _store.getState() } };
};
