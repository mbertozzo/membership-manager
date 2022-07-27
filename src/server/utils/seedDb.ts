import * as dotenv from 'dotenv';
dotenv.config();

import logger from 'pino';
const log = logger();

import User from '../models/user';

async function seed() {
  const user = await User.findOne();

  if (!user) {
    const newUser = new User({
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
      email: process.env.ADMIN_EMAIL,
    });

    await newUser.save().catch(err => log.error(`Error creating admin account: ${err}`));
  }
}

export default seed;
