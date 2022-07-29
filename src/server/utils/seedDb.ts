import * as dotenv from 'dotenv';
dotenv.config();

import logger from 'pino';
const log = logger();

async function seed(db) {
  const user = await db.user.findOne();

  if (!user) {
    await db.user
      .create({
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS,
        email: process.env.ADMIN_EMAIL,
      })
      .catch(err => log.error(`Error creating admin account: ${err}`));
  }
}

export default seed;
