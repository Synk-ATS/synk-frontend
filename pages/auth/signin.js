import React from 'react';
import PropTypes from 'prop-types';
import { getCsrfToken, getSession, signIn } from 'next-auth/react';
import { HeadingLarge } from 'baseui/typography';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import { useRouter } from 'next/router';

export default function SignIn({ csrfToken }) {
  const [css, theme] = useStyletron();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      signIn('credentials', { email, password, redirect: false })
        .then((res) => {
          if (res.ok) {
            router.push('/auth/profile');
          } else {
            alert('Invalid email or password.');
          }
        });
    } else {
      alert('This field cannot be empty');
    }
  }

  return (
    <main className={css({ maxWidth: '1440px', margin: '0 auto', padding: '0 20px' })}>
      <div className={css({ width: '100%', maxWidth: '400px' })}>
        <HeadingLarge color={theme.colors.accent}>Sign in</HeadingLarge>
        <div>
          <form onSubmit={handleSubmit} method="post" action="/api/auth/callback/credentials">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <FormControl>
              <Input
                placeholder="Email"
                value={email}
                type="email"
                onChange={({ currentTarget }) => setEmail(currentTarget.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Password"
                value={password}
                type="password"
                onChange={({ currentTarget }) => setPassword(currentTarget.value)}
              />
            </FormControl>
            <Button type="submit">Sign In</Button>
          </form>
        </div>
      </div>
    </main>
  );
}

SignIn.propTypes = {
  csrfToken: PropTypes.string.isRequired,
};

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        source: '/auth/signin',
        destination: '/auth/profile',
        permanent: false,
      },
    };
  }

  return { props: { csrfToken: await getCsrfToken(context), session } };
}
