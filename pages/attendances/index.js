import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import FacultyAttendance from '../../contents/attendance/faculty-attendance';
import StudentAttendance from '../../contents/attendance/student-attendance';
import { fetchAPI } from '../_app';

function Attendances({ result }) {
  const { data: { user: { role } } } = useSession();

  if (role === 'student') {
    return (<StudentAttendance student={result} />);
  }

  if (role === 'faculty') {
    return (<FacultyAttendance faculty={result} />);
  }
}

Attendances.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

Attendances.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  result: PropTypes.object.isRequired,
};

export default Attendances;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/attendances',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const { user: { role }, jwt } = session;

  let result;

  switch (role) {
    case 'faculty': {
      const { facultyID } = session.user;
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
                        attendances {
                          data {
                            id
                            attributes {
                              date
                              content
                              open
                              timer
                            }
                          }
                        }
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
      result = data.faculty.data;
      break;
    }
    case 'student': {
      const { studentID } = session.user;
      const { data } = await fetchAPI({
        query: gql`
          query Student($id: ID!) {
            student(id: $id) {
              data {
                id
                attributes {
                  uid
                  attendanceRecord
                  courses {
                    data {
                      id
                      attributes {
                        title
                        code
                        attendances {
                          data {
                            id
                            attributes {
                              content
                              course {
                                data {
                                  id
                                  attributes {
                                    students {
                                      data {
                                        id
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
                  }
                }
              }
            }
          }        
        `,
        variables: { id: studentID },
        token: jwt,
      });

      result = data.student.data;
      break;
    }
    default: {
      result = {};
    }
  }

  return { props: { session, result } };
}
