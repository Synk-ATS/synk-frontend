import { initializeApollo } from './apollo';

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

export async function postAPI({ mutation, variables, token }) {
  const apollo = initializeApollo();
  // eslint-disable-next-line no-return-await
  return await apollo.mutate({
    mutation,
    variables,
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });
}
