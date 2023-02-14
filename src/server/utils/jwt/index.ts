import { sign, verify } from 'jsonwebtoken';

import logger from 'pino';
const log = logger();

export const generateToken = ({ id }) => {
  const oneHour = 60 * 2;

  const accesToken = sign({ sub: id }, process.env.SIGNING_KEY, {
    expiresIn: oneHour,
  });

  return accesToken;
};

export const validateToken = token => {
  try {
    const r = verify(token, process.env.SIGNING_KEY);
    return r;
  } catch (error) {
    log.error(`Error deconding JWT: ${error}`);
    return null;
  }
};
