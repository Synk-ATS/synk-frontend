import React from 'react';
import {
  HeadingLarge, HeadingXLarge, ParagraphMedium, ParagraphSmall, ParagraphXSmall,
} from 'baseui/typography';
import { Block } from 'baseui/block';
import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Cpu } from 'phosphor-react';
import { Button, SIZE } from 'baseui/button';
import { useStyletron } from 'baseui';
import Loading from '../../components/atoms/loading';

const CoursesQuery = gql`
  query Courses($email: String!) {
    courses(filters: { students: { email: { eq: $email } } }) {
      data {
        id
        attributes {
          title
          code
          description
          program {
            data {
              attributes {
                name
              }
            }
          }
          faculties {
            data {
              attributes {
                firstName
                lastName
                designation
              }
            }
          }
        }
      }
    }
  }
`;

function StudentCourses() {
  const [css, theme] = useStyletron();
  const { data: session } = useSession();

  const { loading, error, data } = useQuery(CoursesQuery, {
    variables: { email: session.user.email },
    context: { headers: { Authorization: `Bearer ${session.jwt}` } },
  });

  if (loading) {
    return (<Loading loading={loading} />);
  }

  if (error) {
    console.log(error);
  }

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingLarge>Student Courses</HeadingLarge>
      <FlexGrid
        flexGridColumnCount={5}
        flexGridColumnGap="2px"
        flexGridRowGap="2px"
        flexWrap
      >
        {data?.courses?.data.map((course) => {
          const { code } = course.attributes;
          const faculty = course.attributes.faculties.data[0];
          const { designation, firstName, lastName } = faculty.attributes;
          const facultyName = `by ${designation} ${firstName} ${lastName}`;

          return (
            <FlexGridItem
              key={course.id}
              backgroundColor="mono200"
              overrides={{
                Block: {
                  style: ({
                    aspectRatio: '1 / 1',
                    paddingTop: '1.2rem',
                    paddingRight: '1.2rem',
                    paddingBottom: '1.2rem',
                    paddingLeft: '1.2rem',
                    cursor: 'pointer',
                    display: 'grid',
                    alignItems: 'center',
                    transitionProperty: 'all',
                    transitionDuration: theme.animation.timing900,
                    ':hover': {
                      backgroundColor: 'rgba(242,61,79,0.2)',
                    },
                  }),
                },
              }}
            >
              <Block display="flex" justifyContent="space-between" alignItems="center">
                <div className={css({
                  borderRadius: '50%',
                  backgroundColor: 'rgba(242,61,79,0.3)',
                  height: '2.2rem',
                  width: '2.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
                >
                  <Cpu />
                </div>
                <ParagraphXSmall marginTop={0} marginBottom={0}>{code}</ParagraphXSmall>

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
                    }),
                  },
                }}
              >
                {course.attributes.title}
              </ParagraphMedium>
              <ParagraphXSmall overrides={{ Block: { style: ({ marginTop: 0, marginBottom: '10px' }) } }}>
                {facultyName}
              </ParagraphXSmall>
            </FlexGridItem>
          );
        })}
      </FlexGrid>
    </Block>
  );
}

export default StudentCourses;
