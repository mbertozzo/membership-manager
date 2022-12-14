import logger from 'pino';
const log = logger();

import crypto from 'crypto';

import { AuthenticationError, ApolloError, UserInputError } from 'apollo-server-core';

import { Op } from 'sequelize';

import { generateToken } from '../utils/jwt';
import { sendVerificationMail, sendAlreadyRegisteredEmail, sendForgotPasswordMail } from '../utils/mailer';

const resolvers = {
  Query: {
    name: (parent, { firstname, lastname }, context, info) => {
      return `My name is ${firstname} ${lastname}!`;
    },
  },

  Mutation: {
    register: async (_, { firstname, lastname, email, password }, { db }, info) => {
      const alreadyRegistered = await db.user.findOne({ where: { email: email } });

      if (alreadyRegistered) {
        log.info(`Trying to register user ${alreadyRegistered.email}, entry already existing in DB`);
        await sendAlreadyRegisteredEmail(alreadyRegistered);
        throw new UserInputError(`Error while performing registration`);
      }

      const verificationToken = crypto.randomBytes(40).toString('hex');

      const newUser = await db.user.create({
        firstname,
        lastname,
        email,
        password,
        verificationToken,
      });

      log.info(`Successfully created account for user ${newUser.email}`);

      await sendVerificationMail(newUser);

      return 'Registration successful, please check your email for verification instructions';
    },
    verify: async (_, { token }, { db }, info) => {
      const user = await db.user.findOne({ where: { verificationToken: token } });

      if (!user) {
        log.info(`An account verification failed, no entry related`);
        throw new UserInputError('Verification failed');
      }

      if (user.verifiedOn) {
        log.info(`Account ${user.email} tried validation, but was already validated`);
        throw new UserInputError('Already verified');
      }

      await user.update({
        verifiedOn: Date.now(),
        verificationToken: null,
      });

      log.info(`Account ${user.email} successfully verified`);
      return 'Account successfully verified';
    },
    login: async (_, { email, password }, { db, res }, info) => {
      const user = await db.user.findOne({ where: { email } });

      if (!user) {
        log.info(`${email} tried to login, but no match were found in DB`);
        throw new AuthenticationError('Invalid credentials');
      }

      if (!user.verifiedOn) {
        log.info(`${email} tried to login, but account isn't verified yet`);
        throw new AuthenticationError('Account not verified');
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
    forgotPassword: async (_, { email }, { db, res }, info) => {
      const msg =
        "If the email provided matches an existing account, you'll receive a message with a link to reset your password.";
      const user = await db.user.findOne({ where: { email } });

      if (!user) {
        log.info(`${email} asked for a password reset, but no account was found`);
        return msg;
      }

      const resetToken = crypto.randomBytes(40).toString('hex');
      const twoHours = 2 * 60 * 60 * 1000;

      await user.update({
        resetToken,
        resetExpiration: new Date(Date.now() + twoHours),
      });

      log.info(`Correctly set token for password reset for account ${email}`);
      await sendForgotPasswordMail(user);
      return msg;
    },
    changePassword: async (_, { token, password }, { db, res }, info) => {
      const user = await db.user.findOne({
        where: { resetToken: token, resetExpiration: { [Op.gte]: Date.now() } },
      });

      if (!user) {
        log.info('Error while changing password, no account matching with parameters');
        throw new UserInputError('Error: token expired or incorrect parameters');
      }

      await user.update({
        password,
        resetToken: null,
        resetExpiration: null,
      });

      log.info(`Successfully changed password for user ${user.email}`);
      return 'Successfully changed password';
    },
  },
};

export default resolvers;
