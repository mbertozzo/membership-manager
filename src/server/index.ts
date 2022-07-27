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
import helmet from 'helmet';

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
app.use(express.json());

// Temp to make server work while FE is not yet available
// app.use(express.static('dist/client'));
app.use(express.static('public'));

/**
 * Apollo Server configuration
 */
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer(typeDefs, resolvers);

/**
 * Server Activation
 */

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\n\n🚀 Server is running at http://localhost:${PORT}\n`);
});
