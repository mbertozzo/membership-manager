/**
 * Required External Modules
 */

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';

// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

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
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives:
        /*process.env.NODE_ENV === 'production'
          ? undefined
          : {*/
        {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
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
  log.info('NODE_ENV', process.env.NODE_ENV);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    formatError: ({ message, locations, path, extensions }) => ({ message, code: extensions?.code }),
    plugins: [
      apolloLoggerPlugin,
      // ...(process.env.NODE_ENV === 'production' ? [ApolloServerPluginLandingPageDisabled()] : []),
    ],
  });
  await server.start().then(_ => log.info(`Successfully started Apollo Server on path /graphql`));

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const { jwt } = req.cookies;
        const { sub } = validateToken(jwt) || {};

        const user = sub ? await db.user.findOne({ where: { id: sub } }) : undefined;

        return { db, req, res, user };
      },
    }),
  );
}

/**
 * Server Activation
 */
async function startServer() {
  await startDbConnection();

  await startApolloServer(typeDefs, resolvers);

  log.info(process.env.NODE_ENV);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    log.info(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  log.error(`An error occurred: ${err}`);
});
