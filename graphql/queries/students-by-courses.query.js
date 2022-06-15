import { gql } from '@apollo/client';

export const StudsByCourseQuery = gql`
    query Courses($email: String!) {
      courses(filters: {faculties:{email:{contains: $email}}}) {
        data {
          id
          attributes {
            title
            students(sort: ["firstName:desc","lastName:desc"]) {
              data {
                id
                attributes {
                  uid
                  firstName
                  middleName
                  lastName
                  faceDescriptor
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
`;

export const StudsByCourseVars = ({ params }) => ({ email: params.email });
