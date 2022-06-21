import { gql } from '@apollo/client';

export const FacultyIdQuery = gql`
  query FacultyIdQuery($email: String!) {
    faculties(filters: { email: { eq: $email } }) {
      data {
        id
      }
    }
  }
`;

export const FacultyQuery = gql`
  query Faculties($email: String!) {
    faculties(filters: { email: { eq: $email } }) {
      data {
        id
      }
    }
  }
`;
