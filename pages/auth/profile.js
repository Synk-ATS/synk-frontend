import React from 'react';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Button } from 'baseui/button';
import { HeadingLarge, HeadingMedium, HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import Layout from '../../components/layout';
import Loading from '../../components/atoms/loading';
import { TeacherQuery, TeacherVars } from '../../graphql/queries/teacher.query';
import { StudentQuery, StudentVars } from '../../graphql/queries/student.query';
import { fetchAPI } from '../_app';

function Profile({ profile }) {
  const { status, data: session } = useSession();
  const { attributes: { firstName, lastName } } = profile;
  return (
    <>
      <Loading loading={status === 'loading'} />
      <Block paddingLeft={['20px', '20px', '20px', '40px']} paddingRight={['20px', '20px', '20px', '40px']}>
        <HeadingSmall>{`${firstName} ${lastName}`}</HeadingSmall>
        <Block backgroundColor="mono300" padding={['20px', '20px', '20px', '20px']}>
          s
        </Block>
        <Button onClick={() => signOut()}>Sign out</Button>
      </Block>
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
