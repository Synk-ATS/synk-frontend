import { gql } from '@apollo/client';

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
                  course_code
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
