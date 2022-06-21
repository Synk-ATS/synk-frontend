import { gql } from '@apollo/client';

const CreateAttendanceMutation = gql`
   mutation CreateAttendance($courseID: ID!, $date: Date!, $timer: Int!, $open: Boolean, $content: JSON!) {
      createAttendance(data: { course: $courseID, date: $date, timer: $timer, open: $open, content: $content }) {
        data {
          id
          attributes {
            date
            open
            timer
            content
            course {
              data {
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
`;

export default CreateAttendanceMutation;
