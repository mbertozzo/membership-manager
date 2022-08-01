import logger from 'pino';
const log = logger();

import sendEmail from './sendEmail';

async function sendVerificationMail(user) {
  await sendEmail({
    to: user.email,
    subject: 'Verify Email',
    html: `<p>Welcome <strong>${user.firstname}</strong>,<br />thanks for registering!</p>
           <p>Please use the below token to verify your email address:</p>
           <p><code>${user.verificationToken}</code></p>`,
  });
  log.info(`Sent account verification message to ${user.email}`);
}

export default sendVerificationMail;
