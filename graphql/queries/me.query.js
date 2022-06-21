import { gql } from '@apollo/client';

const MeQuery = gql`
    query Me {
      me {
        role {
          id
          type
        }
      }
    }
`;

export default MeQuery;
