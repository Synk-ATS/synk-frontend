import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { gql } from '@apollo/client';
import { fetchAPI } from '../../_app';

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
          const { data } = await axios.post(`${process.env.AUTH_API}/api/auth/local`, {
            identifier: credentials.email,
            password: credentials.password,
          });

          const { data: { role } } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${data.jwt}` },
          });

          let user;

          switch (role.type) {
            case 'faculty': {
              const { data: { faculties } } = await fetchAPI({
                query: gql`
                  query Faculties($email: String!) {
                    faculties(filters: {email: {eq: $email}}){
                      data {
                        id
                      }
                    }
                  }
                `,
                variables: { email: data.user.email },
                token: data.jwt,
              });
              const facultyID = faculties.data[0].id;
              user = { ...data, role: role.type, facultyID };
              break;
            }
            case 'student': {
              const { data: { students } } = await fetchAPI({
                query: gql`
                  query Students($email: String!) {
                    students(filters: {email: {eq: $email}}){
                      data {
                        id
                      }
                    }
                  }
                `,
                variables: { email: data.user.email },
                token: data.jwt,
              });
              const studentID = students.data[0].id;
              user = { ...data, role: role.type, studentID };
              break;
            }
            default: {
              user = {};
            }
          }

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
      switch (token.user.role) {
        case 'faculty':
          _session.user = {
            ...token.user.user,
            role: token.user.role,
            facultyID: token.user.facultyID,
          };
          break;
        case 'student':
          _session.user = {
            ...token.user.user,
            role: token.user.role,
            studentID: token.user.studentID,
          };
          break;
        default:
          return null;
      }
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
