import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

export class AuthenticationError extends GraphQLError {
  constructor(opts) {
    super(opts);
    this.extensions.code = 'UNAUTHENTICATED';
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(opts) {
    super(opts);
    this.extensions.code = 'FORBIDDEN';
  }
}

export class UserInputError extends GraphQLError {
  constructor(opts) {
    super(opts);
    this.extensions.code = ApolloServerErrorCode.BAD_USER_INPUT;
  }
}
