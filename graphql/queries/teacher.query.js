import { gql } from '@apollo/client';

export const TeacherQuery = gql`
    query Faculty($email: String!) {
      faculties(filters: {email:{contains: $email}}) {
        data {
          id
          attributes {
            uid
            firstName
            middleName
            lastName
            email
            gender
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
            course {
              data {
                id
                attributes {
                  title
                  course_code
                  description
                }
              }
            }
          
          }
        }
      }
    }                  
`;

export const TeacherVars = ({ params }) => ({ email: params.email });
