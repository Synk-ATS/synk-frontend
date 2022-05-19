import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import { DisplayMedium, ParagraphSmall } from 'baseui/typography';
import axios from 'axios';
import Layout from '../../components/layout';

function Profile({ me }) {
  const { data: session, status } = useSession();
  console.log(me);
  return (
    <>
      {status === 'loading' ? (<ParagraphSmall>Loading...</ParagraphSmall>) : null}
      <div>
        {/* <DisplayMedium>{session.user.}</DisplayMedium> */}
        <DisplayMedium>sss</DisplayMedium>
      </div>
    </>
  );
}

export default Profile;

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

  const { data } = await axios.get('http://localhost:1337/api/users/me', {
    headers: { Authorization: `Bearer ${session.jwt}` },
  });

  return { props: { session, me: data } };
}
