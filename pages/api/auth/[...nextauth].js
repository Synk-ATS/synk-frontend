import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirebaseAdapter } from '@next-auth/firebase-adapter';
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, query, getDocs,
  where, limit, doc, getDoc, addDoc, updateDoc, deleteDoc, runTransaction,
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../../../lib/firebase';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

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
          let user;

          await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password,
          ).then((userCredentials) => {
            user = userCredentials.user;
          });

          // const { data } = await axios.post(process.env.AUTH_API, {
          //   identifier: credentials.email,
          //   password: credentials.password,
          // });
          //
          // const user = login;
          //
          if (user) {
            return user;
          }

          return null;
        }

        return null;
      },
    }),
  ],
  adapter: FirebaseAdapter({
    db,
    collection,
    query,
    getDocs,
    where,
    limit,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    runTransaction,
  }),
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
      _session.token = token?.accessToken;
      _session.user = token?.user;
      _session.expires = token.expires;
      await _session;
      return _session;
    },
    async jwt({ token, user }) {
      const isSignIn = !!user;
      const _token = token;

      if (isSignIn) {
        console.log(user);
        _token.accessToken = user?.accessToken;
        _token.user = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoUrl,
        };
        _token.expires = user.stsTokenManager.expirationTime;
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
