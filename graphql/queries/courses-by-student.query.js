import { gql } from '@apollo/client';

export const CoursesByStudent = gql`
    query Course($id: ID!) {
      courses {
        data {
          id
          attributes {
            title
            code
            description
            students(filters:{id:{eq: $id}}) {
              data {
                id
                attributes {
                  firstName
                  lastName
                }
              }
            }
            attendances {
              data {
                id
                attributes {
                  status
                  date
                  content
                }
              }
            }
            program {
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

export const CoursesByStudentVars = ({ params }) => ({ id: params.id });
