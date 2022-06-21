import { gql } from '@apollo/client';

export const AttendanceQuery = gql`
  query Attendance($id: ID!) {
      attendance(id: $id) {
        data {
          id
          attributes {
            date
            open
            timer
            content
            course {
              data {
                attributes {
                  title
                  code
                  faculty {
                    data {
                      id
                      attributes {
                        uid
                        firstName
                        lastName
                        email
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
          }
        }
      }
    }
`;

export default AttendanceQuery;
