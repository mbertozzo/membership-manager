import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    firstname: String
    lastname: String
    email: String!
  }

  type Org {
    name: String!
    description: String
    userIsAdmin: String
  }

  type Query {
    name(firstname: String!, lastname: String!): String
    listOrg: [Org]
  }

  type Mutation {
    register(firstname: String!, lastname: String!, email: String!, password: String!): String
    verify(token: String!): String
    login(email: String!, password: String!): User!
    forgotPassword(email: String!): String
    changePassword(token: String!, password: String!): String
    createOrg(name: String!, description: String): String
    createMember(name: String!, surname: String!, email: String!, orgId: String!): String
  }
`;

export default typeDefs;
