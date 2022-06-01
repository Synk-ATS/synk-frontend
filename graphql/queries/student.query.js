import { gql } from '@apollo/client';

export const StudentQuery = gql`
    query Student($email: String!) {
      students(filters: {email:{contains: $email}}) {
        data {
          id
          attributes {
            firstName
            lastName
            email
            gender
            level
            avatar {
              data {
                id
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

export const StudentVars = ({ params }) => ({ email: params.email });
