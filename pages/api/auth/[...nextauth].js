import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const options = {
  providers: [
    CredentialsProvider({
      name: 'Synk',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if ('email' in credentials && 'password' in credentials) {
          const { data } = await axios.post(process.env.AUTH_API, {
            identifier: credentials.email,
            password: credentials.password,
          });

          const { data: { role } } = await axios.get('http://localhost:1337/api/users/me', {
            headers: { Authorization: `Bearer ${data.jwt}` },
          });

          const user = { ...data, role: role.type };
          if (user) {
            return user;
          }

          return null;
        }

        return null;
      },
    }),
  ],

  session: { strategy: 'jwt' },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      const _session = session;
      _session.jwt = token.jwt;
      _session.user = { ...token.user.user, role: token.user.role };
      await _session;
      return _session;
    },
    async jwt({ token, user }) {
      const isSignIn = !!user;
      const _token = token;

      if (isSignIn) {
        _token.jwt = user.jwt;
        _token.user = user;
      }

      await _token;
      return _token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
};

export default (req, res) => NextAuth(req, res, options);
