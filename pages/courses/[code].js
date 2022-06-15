import React from 'react';
import { gql } from '@apollo/client';
import { getSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import { Block } from 'baseui/block';
import { HeadingLarge } from 'baseui/typography';
import { fetchAPI } from '../_app';

function Code({ course }) {
  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingLarge>{course.attributes.title}</HeadingLarge>
    </Block>
  );
}

export default Code;

Code.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  course: PropTypes.object.isRequired,
};

const CourseQuery = gql`
   query Course($code: String!) {
      courses(filters: { code: { eq: $code } }) {
        data {
          id
          attributes {
            title
            code
            description
            students {
              data {
                attributes {
                  uid
                  email
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
`;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/courses/[code]',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { data } = await fetchAPI({
    query: CourseQuery,
    variables: { code: context.params.code },
  });

  return { props: { session, course: data.courses.data[0] } };
}
