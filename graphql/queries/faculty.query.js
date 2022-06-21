import { gql } from '@apollo/client';

export const FacultyIdQuery = gql`
  query FacultyIdQuery($email: String!) {
    faculties(filters: { email: { eq: $email } }) {
      data {
        id
      }
    }
  }
`;

export const AppFacultyQuery = gql`
  query Faculty($id: ID!) {
      faculty(id: $id) {
        data {
          id
          attributes {
            firstName
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
`;

export const FacultyQuery = gql`
  query Faculty($id: ID!) {
      faculty(id: $id) {
        data {
          attributes {
            uid
            firstName
            middleName
            lastName
            email
            gender
            phone
            nationality
            address
            designation
            avatar {
              data {
                attributes {
                  url
                }
              }
            }
            course {
              data {
                id
                attributes {
                  title
                }
              }
            }
            department {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }
`;
