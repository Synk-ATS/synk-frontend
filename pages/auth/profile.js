import React from 'react';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Button, SIZE } from 'baseui/button';
import { HeadingXLarge, ParagraphSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Avatar } from 'baseui/avatar';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import {
  Envelope, MapPin, Phone, SignOut,
} from 'phosphor-react';
import { useStyletron } from 'baseui';
import Layout from '../../components/layout';
import Loading from '../../components/atoms/loading';
import { TeacherQuery, TeacherVars } from '../../graphql/queries/teacher.query';
import { StudentQuery, StudentVars } from '../../graphql/queries/student.query';
import { fetchAPI } from '../_app';

function Profile({ profile }) {
  const [css, theme] = useStyletron();
  const { status, data: session } = useSession();

  return (
    <>
      <Loading loading={status === 'loading'} />
      <Block
        paddingTop={['20px', '20px', '20px', '40px']}
        paddingRight={['20px', '20px', '20px', '40px']}
        paddingLeft={['20px', '20px', '20px', '40px']}
      >
        <FlexGrid flexGridColumnCount={2}>
          <FlexGridItem
            width="18rem"
            maxWidth="18rem"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            height="100%"
          >
            <Avatar
              name={`${profile.attributes.firstName} ${profile.attributes.lastName}`}
              size="18rem"
              src={profile.attributes.avatar.data.attributes?.url}
            />
            <Block paddingTop="1.5rem" display="flex" justifyContent="center" alignItems="flex-start">
              <Button onClick={() => signOut()} size={SIZE.mini} startEnhancer={(<SignOut />)}>
                Sign out
              </Button>
            </Block>
          </FlexGridItem>
          <FlexGridItem paddingLeft={['20px', '20px', '20px', '40px']}>
            <HeadingXLarge
              marginTop="1rem"
              marginBottom="1rem"
              overrides={{ Block: { style: ({ fontWeight: '600' }) } }}
            >
              {`${profile.attributes.lastName}, ${profile.attributes.firstName} ${profile.attributes.middleName}`}
            </HeadingXLarge>
            {profile.attributes.email !== null ? (
              <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex" alignItems="center">
                <Envelope size="1.5rem" color={theme.colors.accent} />
                <Block width="10px" />
                {profile.attributes.email}
              </ParagraphSmall>
            ) : null}
            {profile.attributes.phone !== null ? (
              <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex" alignItems="center">
                <Phone size="1.5rem" color={theme.colors.accent} />
                <Block width="10px" />
                {profile.attributes.phone}
              </ParagraphSmall>
            ) : null}
            {profile.attributes.address !== null ? (
              <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
                <MapPin size="1.5rem" color={theme.colors.accent} />
                <Block width="10px" />
                <span style={{ maxWidth: '16rem' }}>{profile.attributes.address}</span>
              </ParagraphSmall>
            ) : null}
            <Block
              height="1px"
              width="100%"
              backgroundColor={theme.colors.mono500}
              marginTop="2rem"
              marginBottom="2rem"
            />

            <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
              <span style={{ fontWeight: '600' }}>Gender:</span>
              <Block width="10px" />
              {profile.attributes.gender}
            </ParagraphSmall>
            <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
              <span style={{ fontWeight: '600' }}>Department:</span>
              <Block width="10px" />
              {profile.attributes.department.data.attributes.name}
            </ParagraphSmall>
            {session.user.role === 'student' ? (
              <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
                <span style={{ fontWeight: '600' }}>Level:</span>
                <Block width="10px" />
                {profile.attributes.level.split('_')[1]}
              </ParagraphSmall>
            ) : null}
            {session.user.role === 'faculty' ? (
              <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
                <span style={{ fontWeight: '600' }}>Course:</span>
                <Block width="10px" />
                {profile.attributes.course.data.attributes?.title}
              </ParagraphSmall>
            ) : null}
            <ParagraphSmall marginTop={0} marginBottom="1rem" display="flex">
              <span style={{ fontWeight: '600' }}>Nationality:</span>
              <Block width="10px" />
              {profile.attributes.nationality}
            </ParagraphSmall>
          </FlexGridItem>
        </FlexGrid>
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
