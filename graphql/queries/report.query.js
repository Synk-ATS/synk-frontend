import { gql } from '@apollo/client';

const ReportQuery = gql`
    query Faculty($id: ID!) {
      faculty(id: $id) {
        data {
          id
          attributes {
            course {
              data {
                id
                attributes {
                  code
                  attendances {
                    data {
                      id
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
                        attendanceRecord
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

export default ReportQuery;
