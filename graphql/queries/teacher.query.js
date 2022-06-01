import { gql } from '@apollo/client';

export const TeacherQuery = gql`
    query Faculty($email: String!) {
      faculties(filters: {email:{contains: $email}}) {
        data {
          id
          attributes {
            firstName
            lastName
            facultyId
            email
            gender
            avatar {
              data {
                id
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

export const TeacherVars = ({ params }) => ({ email: params.email });
