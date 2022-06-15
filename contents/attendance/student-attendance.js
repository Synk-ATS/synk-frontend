import React from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import {
  HeadingMedium, ParagraphLarge, ParagraphMedium, ParagraphXSmall,
} from 'baseui/typography';
import { useSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Cpu } from 'phosphor-react';
import { Button, SIZE } from 'baseui/button';
import { selectAuth } from '../../redux/slices/auth.slice';
import Loading from '../../components/atoms/loading';

const StudentsQuery = gql`
  query Student($uid: String!) {
    students(filters: {uid: {eq: $uid}}) {
      data {
        id
        attributes {
          courses {
            data {
              id
              attributes {
                title
                code
                description
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
      }
    }
  }
`;

function StudentAttendance() {
  const [css, theme] = useStyletron();

  const { data: { jwt } } = useSession();
  const { profile: { attributes: { uid } } } = useSelector(selectAuth);

  const { loading, error, data } = useQuery(StudentsQuery, {
    variables: { uid },
    context: { headers: { Authorization: `Bearer ${jwt}` } },
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
      <HeadingMedium marginBottom={0}>Class Attendance</HeadingMedium>
      <FlexGrid
        flexGridColumnCount={5}
        flexGridColumnGap="2px"
        flexGridRowGap="2px"
        flexWrap
      >
        {data.students.data[0].attributes.courses.data.map((course) => {
          const {
            designation, firstName, lastName,
          } = course.attributes.faculties.data[0].attributes;
          const faculty = `by ${designation} ${firstName} ${lastName}`;

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
              <ParagraphXSmall overrides={{ Block: { style: ({ marginTop: 0, marginBottom: '10px', fontSize: '10px' }) } }}>
                {faculty}
              </ParagraphXSmall>
              <Button size={SIZE.mini}>View</Button>
            </FlexGridItem>
          );
        })}
      </FlexGrid>
    </Block>
  );
}

export default StudentAttendance;
