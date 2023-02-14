/**
 * Required External Modules
 */

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import logger from 'pino';
const log = logger();

import apolloLoggerPlugin from './utils/apolloLoggerPlugin';

import { validateToken } from './utils/jwt';

import db from './models';
import seed from './utils/seedDb';

import typeDefs from './gql/schema';
import resolvers from './gql/resolvers';

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              'script-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
              'style-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
              'img-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
              'style-src-elem': ["'self'", 'fonts.googleapis.com', 'cdn.jsdelivr.net', "'unsafe-inline'"],
            },
    },
  }),
);
app.use(cors({ origin: '*' }));
app.use(cookieParser());
app.use(express.json());

// Temp to make server work while FE is not yet available
// app.use(express.static('dist/client'));
app.use(express.static('public'));

/**
 * DB connection
 */
async function startDbConnection() {
  await db.sequelize.authenticate().then(_ => log.info(`Successfully connected to database`));
  await db.sequelize.sync({ force: true }).then(_ => log.info(`Successfully synced tables`));

  await seed(db).then(_ => log.info(`Successfully created admin user`));
}

/**
 * Apollo Server configuration
 */
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }) => {
      const { jwt } = req.cookies;
      const { sub } = validateToken(jwt) || {};

      const user = sub ? await db.user.findOne({ where: { id: sub } }) : undefined;

      return { db, req, res, user };
    },
    formatError: ({ message, locations, path, extensions }) => ({ message, code: extensions.code }),
    plugins: [
      apolloLoggerPlugin,
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start().then(_ => log.info(`Successfully started Apollo Server on path ${server.graphqlPath}`));

  server.applyMiddleware({ app });
}

/**
 * Server Activation
 */
async function startServer() {
  await startDbConnection();

  await startApolloServer(typeDefs, resolvers);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    log.info(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  log.error(`An error occurred: ${err}`);
});
