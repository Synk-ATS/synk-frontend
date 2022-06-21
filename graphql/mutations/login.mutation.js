import { gql } from '@apollo/client';

const LoginMutation = gql`
   mutation Login($identifier: String!, $password: String!) {
     login(input: {identifier: $identifier, password: $password}) {
       jwt
       user {
         id
         username
         email
       }
     }
   }
`;

export default LoginMutation;
