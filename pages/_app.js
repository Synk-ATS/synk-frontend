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
import styletron from '../lib/styletron';
import SynkTheme from '../lib/theme';
import synkStore from '../redux/store';
import { initializeApollo, useApollo } from '../lib/apollo';
import Loading from '../components/atoms/loading';
import '../styles/globals.css';
import 'normalize.css';
import { getProfile } from '../redux/slices/global.slice';
import { setProfile, setSignInType, USER_TYPE } from '../redux/slices/auth.slice';
import { TeacherQuery, TeacherVars } from '../graphql/queries/teacher.query';
import { StudentQuery, StudentVars } from '../graphql/queries/student.query';

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

export async function fetchAPI({ query, variables, token }) {
  const apollo = initializeApollo();
  // eslint-disable-next-line no-return-await
  return await apollo.query({
    query,
    variables,
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });
}

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);
  const _store = synkStore();

  const session = await getSession(context);

  if (session) {
    const params = { email: session.user.email };
    const { dispatch } = _store;
    let result;

    switch (session.user.role) {
      case 'faculty':
        dispatch(setSignInType(USER_TYPE.teacher));
        const { data: { faculties } } = await fetchAPI({
          query: TeacherQuery,
          variables: TeacherVars({ params }),
        });
        result = faculties.data[0];
        break;
      case 'student':
        dispatch(setSignInType(USER_TYPE.student));
        const { data: { students } } = await fetchAPI({
          query: StudentQuery,
          variables: StudentVars({ params }),
        });
        result = students.data[0];
        break;
      default:
        result = {};
    }
    dispatch(setProfile(result));
    dispatch(getProfile(result), { payload: result });
  }

  return { ...appProps, pageProps: { initialReduxState: _store.getState() } };
};
