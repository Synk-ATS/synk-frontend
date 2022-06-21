import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import RoleQuery from '../../../graphql/queries/role.query';
import { FacultyIdQuery } from '../../../graphql/queries/faculty.query';
import { StudentIdQuery } from '../../../graphql/queries/student.query';
import { fetchAPI, postAPI } from '../../../lib/api';
import LoginMutation from '../../../graphql/mutations/login.mutation';

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
          const { data: { login } } = await postAPI({
            mutation: LoginMutation,
            variables: { identifier: credentials.email, password: credentials.password },
          });

          const { data: { me: { role } } } = await fetchAPI({
            query: RoleQuery, token: login.jwt,
          });

          let user;

          switch (role.type) {
            case 'faculty': {
              const { data: { faculties } } = await fetchAPI({
                query: FacultyIdQuery,
                variables: { email: login.user.email },
                token: login.jwt,
              });
              const facultyID = faculties.data[0].id;
              user = { ...login, role: role.type, facultyID };
              break;
            }
            case 'student': {
              const { data: { students } } = await fetchAPI({
                query: StudentIdQuery,
                variables: { email: login.user.email },
                token: login.jwt,
              });
              const studentID = students.data[0].id;
              user = { ...login, role: role.type, studentID };
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
