import React from 'react';
import { getSession } from 'next-auth/react';
import { Block } from 'baseui/block';
import { DisplayLarge, ParagraphLarge } from 'baseui/typography';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <DisplayLarge overrides={{
        Block: {
          style: ({
            marginTop: '10rem',
            fontWeight: '600',
          }),
        },
      }}
      >
        Raftel
      </DisplayLarge>
      <ParagraphLarge overrides={{
        Block: {
          style: ({
            fontWeight: '600',
          }),
        },
      }}
      >
        Student Attendance Tracking System
      </ParagraphLarge>
    </Block>
  );
}

Home.getLayout = function getLayout(page) {
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
        source: '/index',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
