import { gql } from '@apollo/client';

const DeleteAttendanceMutation = gql`
  mutation DeleteAttendance($id: ID!) {
    deleteAttendance(id: $id) {
      data {
        id
      }
    }
  }
`;

export default DeleteAttendanceMutation;
