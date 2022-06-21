import { gql } from '@apollo/client';

const CoursesQuery = gql`
  query StudentCourses($id: ID!) {
      student(id:$id) {
        data {
          attributes {
            courses {
              data {
                id 
                attributes {
                  title
                  code
                  faculty {
                    data {
                      attributes {
                        firstName
                        lastName
                        designation
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

export default CoursesQuery;
