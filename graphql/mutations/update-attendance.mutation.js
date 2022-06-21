import { gql } from '@apollo/client';

const UpdateAttendanceMutation = gql`
  mutation UpdateAttendance($id: ID!, $content: JSON, $open: Boolean) {
    updateAttendance(id: $id, data: {content: $content, open: $open}) {
      data {
        id
        attributes {
          date
          open
          timer
          content
        }
      }
    }
  }
`;

export default UpdateAttendanceMutation;
