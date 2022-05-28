import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };
export const firebaseConfig = {
  apiKey: 'AIzaSyBSl1D_s8SuCU1rGrCkNcQGTO_foDTv9mA',
  authDomain: 'synk-store.firebaseapp.com',
  projectId: 'synk-store',
  storageBucket: 'synk-store.appspot.com',
  messagingSenderId: '329857093182',
  appId: '1:329857093182:web:396d1d3fadc6125ddc8b6f',
};

const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);
export const firestore = getFirestore(firebase);

export default firebase;
