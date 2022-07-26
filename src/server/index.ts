/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static('dist/client'));

/**
 * Server Activation
 */

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\n\n🚀 Server is running at http://localhost:${PORT}\n`);
});
