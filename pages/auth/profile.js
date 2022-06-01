import React from 'react';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Button } from 'baseui/button';
import Layout from '../../components/layout';
import Loading from '../../components/atoms/loading';
import { TeacherQuery, TeacherVars } from '../../graphql/queries/teacher.query';
import { StudentQuery, StudentVars } from '../../graphql/queries/student.query';
import { fetchAPI } from '../_app';

function Profile({ profile }) {
  const { status, data: session } = useSession();

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

Profile.propTypes = {};

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
  const params = { email: session.user.email };
  let profile;
  switch (session.user.role) {
    case 'faculty':
      const { data: { faculties } } = await fetchAPI({
        query: TeacherQuery,
        variables: TeacherVars({ params }),
      });
      profile = faculties.data[0];
      break;
    case 'student':
      const { data: { students } } = await fetchAPI({
        query: StudentQuery,
        variables: StudentVars({ params }),
      });
      profile = students.data[0];
      break;
    default:
      profile = {};
  }

  return { props: { session, profile } };
}
