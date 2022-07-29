import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    firstname: String
    lastname: String
    email: String!
  }

  type Query {
    name(firstname: String!, lastname: String!): String
  }

  type Mutation {
    login(email: String!, password: String!): User!
  }
`;

export default typeDefs;
