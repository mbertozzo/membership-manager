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
    register(firstname: String!, lastname: String!, email: String!, password: String!): String
    verify(token: String!): String
    login(email: String!, password: String!): User!
    forgotPassword(email: String!): String
    changePassword(token: String!, password: String!): String
  }
`;

export default typeDefs;
