import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    name(firstname: String!, lastname: String!): String
  }
`;

export default typeDefs;
