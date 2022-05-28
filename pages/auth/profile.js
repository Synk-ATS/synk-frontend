import React from 'react';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Button } from 'baseui/button';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import Loading from '../../components/atoms/loading';
import { Student } from '../../models/student';

function Profile({ student }) {
  const { status } = useSession();

  return (
    <>
      <Loading loading={status === 'loading'} />
      <div>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    </>
  );
}

export default Profile;

Profile.propTypes = {
  student: PropTypes.instanceOf(Student).isRequired,
};

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/auth/profile',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  try {
    const db = getFirestore();
    const ref = doc(db, 'students', `${session.user.uid}`);

    const docSnap = await getDoc(ref);

    return { props: { session, student: docSnap.data() } };
  } catch (e) {
    return { props: { session } };
  }
}
