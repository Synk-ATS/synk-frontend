import React from 'react';
import { HeadingLarge, HeadingXLarge } from 'baseui/typography';
import { Block } from 'baseui/block';
import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Loading from '../../components/atoms/loading';

const CoursesQuery = gql`
  query Courses($email: String!) {
    courses(filters: { students: { email: { eq: $email } } }) {
      data {
        id
        attributes {
          title
          course_code
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
  const { data: session } = useSession();

  const { loading, error, data } = useQuery(CoursesQuery, {
    variables: { email: session.email },
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
    </Block>
  );
}

export default StudentCourses;
