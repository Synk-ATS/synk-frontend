import { gql } from '@apollo/client';

export const StudentIdQuery = gql`
  query StudentIdQuery($email: String!) {
    students(filters: { email: { eq: $email } }) {
      data {
        id
      }
    }
  }
`;

export const AppStudentQuery = gql`
  query Student($id: ID!) {
      student(id: $id) {
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

export const StudentQuery = gql`
    query Student($id: ID!) {
      student(id: $id) {
        data {
          attributes {
            uid
            firstName
            middleName
            lastName
            email
            phone
            address
            gender
            level
            nationality
            avatar {
              data {
                attributes {
                  url
                }
              }
            }
            department {
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
`;

export const StudentVars = ({ params }) => ({ email: params.email });
