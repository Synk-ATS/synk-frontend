/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { HeadingMedium, ParagraphMedium } from 'baseui/typography';
import { Block } from 'baseui/block';
import { getSession } from 'next-auth/react';
import { gql } from '@apollo/client';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { useStyletron } from 'baseui';
import { Avatar } from 'baseui/avatar';
import { fetchAPI } from './_app';
import Layout from '../components/layout';

function Students({ faculty }) {
  const [css] = useStyletron();

  const { course: { data: { attributes: { students } } } } = faculty.attributes;

  const TABLE_DATA = students.data.map((student, index) => {
    const {
      uid, firstName, middleName, lastName, avatar,
    } = student.attributes;

    return {
      sn: index + 1,
      avatar: avatar.data.attributes.url,
      student: `${lastName}, ${firstName} ${middleName}`,
      studentUID: uid,
    };
  });

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <Block marginTop="30px" display="flex" justifyContent="space-between" alignItems="center">
        <HeadingMedium marginTop={0} marginBottom={0}>
          Students
        </HeadingMedium>
      </Block>
      <Block marginTop="20px">
        <TableBuilder data={TABLE_DATA}>
          <TableBuilderColumn header="#">
            {(row) => <ParagraphMedium maxWidth="30px">{row.sn}</ParagraphMedium>}
          </TableBuilderColumn>
          <TableBuilderColumn header="AVATAR">
            {(row) => (
              <Block maxWidth="50px">
                <Avatar size="48px" src={row.avatar} name="" />
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="STUDENT">
            {(row) => (
              <ParagraphMedium className={css({ fontWeight: '600' })}>
                {row.student}
              </ParagraphMedium>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="STUDENT UID">
            {(row) => (
              <ParagraphMedium className={css({ fontWeight: '600' })}>
                {row.studentUID}
              </ParagraphMedium>
            )}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
    </Block>
  );
}

Students.propTypes = {
  faculty: PropTypes.object.isRequired,
};

Students.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Students;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/attendances/report',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { user: { facultyID }, jwt } = session;

  const { data } = await fetchAPI({
    query: gql`
          query Faculty($id: ID!) {
            faculty(id: $id) {
              data {
                id
                attributes {
                  uid
                  designation
                  firstName
                  lastName
                  email
                  course {
                    data {
                      id
                      attributes {
                        code
                        title
                        students {
                          data {
                            id
                            attributes {
                              uid
                              firstName
                              middleName
                              lastName
                              avatar {
                                data {
                                  attributes {
                                    url
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  program {
                    data {
                      attributes {
                        name
                      }
                    }
                  } 
                }
              }
            }
          }
        `,
    variables: { id: facultyID },
    token: jwt,
  });

  return { props: { session, faculty: data.faculty.data } };
}
