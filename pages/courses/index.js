/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { getSession } from 'next-auth/react';
import { HeadingLarge, ParagraphMedium, ParagraphXSmall } from 'baseui/typography';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Block } from 'baseui/block';
import { Cpu } from 'phosphor-react';
import { useRouter } from 'next/router';
import { useStyletron } from 'baseui';
import Layout from '../../components/layout';
import { fetchAPI } from '../../lib/api';
import CoursesQuery from '../../graphql/queries/courses.query';
import Loading from '../../components/atoms/loading';

function Courses({ role, courses, loading }) {
  const router = useRouter();
  const [css, theme] = useStyletron();

  if (loading) {
    return (<Loading loading={loading} />);
  }

  if (role === 'faculty') {
    return null;
  }

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingLarge>My Courses</HeadingLarge>
      <FlexGrid
        flexGridColumnCount={5}
        flexGridColumnGap="2px"
        flexGridRowGap="2px"
        flexWrap
      >
        {courses?.data.map((course) => {
          const { code } = course.attributes;
          const faculty = course.attributes.faculty.data;
          const { designation, firstName, lastName } = faculty.attributes;
          const facultyName = `by ${designation} ${firstName} ${lastName}`;

          return (
            <FlexGridItem
              key={course.id}
              onClick={async () => {
                await router.push({
                  pathname: '/courses/[code]',
                  query: { code: course.attributes.code },
                });
              }}
              backgroundColor="mono900"
              overrides={{
                Block: {
                  style: ({
                    aspectRatio: '1 / 1',
                    paddingTop: '1rem',
                    paddingRight: '1.2rem',
                    paddingBottom: '1rem',
                    paddingLeft: '1.2rem',
                    cursor: 'pointer',
                    display: 'grid',
                    alignItems: 'center',
                    transitionProperty: 'all',
                    transitionDuration: theme.animation.timing900,
                    ':hover': {
                      backgroundColor: 'rgba(242,61,79)',
                    },
                  }),
                },
              }}
            >
              <Block display="flex" justifyContent="space-between" alignItems="center">
                <div className={css({
                  borderRadius: '50%',
                  backgroundColor: 'rgba(242,61,79,0.7)',
                  height: '2.2rem',
                  width: '2.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.mono200,
                })}
                >
                  <Cpu />
                </div>
                <ParagraphXSmall marginTop={0} marginBottom={0} color="mono600">{code}</ParagraphXSmall>

              </Block>
              <ParagraphMedium
                overrides={{
                  Block: {
                    style: ({
                      marginTop: 0,
                      marginBottom: 0,
                      fontWeight: '500',
                      fontSize: '1.2rem',
                      lineHeight: '1.6rem',
                      maxHeight: '4rem',
                      height: '4rem',
                      display: 'flex',
                      alignItems: 'flex-end',
                      color: theme.colors.mono100,
                    }),
                  },
                }}
              >
                {course.attributes.title}
              </ParagraphMedium>
              <ParagraphXSmall overrides={{
                Block: {
                  style: ({
                    color: theme.colors.mono600,
                    marginTop: 0,
                    marginBottom: '10px',
                  }),
                },
              }}
              >
                {facultyName}
              </ParagraphXSmall>
            </FlexGridItem>
          );
        })}
      </FlexGrid>
    </Block>
  );
}

Courses.propTypes = {
  role: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  courses: PropTypes.object.isRequired,
};

Courses.getLayout = function getLayout(page) {
  return (<Layout>{page}</Layout>);
};

export default Courses;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/courses',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { jwt, user } = session;
  const { role, studentID } = user;

  const { data, loading } = await fetchAPI({
    query: CoursesQuery,
    variables: { id: studentID },
    token: jwt,
  });

  return {
    props: {
      session, role, loading, courses: data.student.data.attributes.courses,
    },
  };
}
