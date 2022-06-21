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

export const StudentQuery = gql`
    query Student($email: String!) {
      students(filters: {email:{contains: $email}}) {
        data {
          id
          attributes {
            firstName
            middleName
            lastName
            email
            gender
            level
            phone
            address
            nationality
            avatar {
              data {
                attributes {
                  url
                }
              }
            }
            courses {
              data {
                id
                attributes {
                  title
                  code
                  description
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
