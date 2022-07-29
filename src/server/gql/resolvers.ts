import logger from 'pino';
const log = logger();

import { AuthenticationError, ApolloError } from 'apollo-server-core';

import { generateToken } from '../utils/jwt';

const resolvers = {
  Query: {
    name: (parent, { firstname, lastname }, context, info) => {
      return `My name is ${firstname} ${lastname}!`;
    },
  },

  Mutation: {
    login: async (_, { email, password }, { db, res }, info) => {
      const user = await db.user.findOne({ where: { email: email } });

      if (!user) {
        log.info(`${email} tried to login, but no match were found in DB`);
        throw new AuthenticationError('Invalid credentials');
      }

      const isValid = await user.validatePassword(password);

      if (isValid) {
        log.debug('Sent token');
        const token = generateToken({ id: user.id.toString() });

        res.cookie('jwt', token, {
          httpOnly: true,
          domain: 'localhost',
        });

        return user;
      } else {
        log.info(`${email} tried to login, but password hashes didn't match`);
        throw new AuthenticationError('Invalid credentials');
      }
    },
  },
};

export default resolvers;
