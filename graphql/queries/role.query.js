import { gql } from '@apollo/client';

const RoleQuery = gql`
    query Me {
      me {
        role {
          type
        }
      }
    }
`;

export default RoleQuery;
