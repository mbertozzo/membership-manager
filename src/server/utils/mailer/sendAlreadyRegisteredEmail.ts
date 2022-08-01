import logger from 'pino';
const log = logger();

import sendEmail from './sendEmail';

async function sendAlreadyRegisteredEmail(email) {
  let message;
  // if (origin) {
  //   message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
  // } else {
  //   message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  // }

  await sendEmail({
    to: email,
    subject: 'Email Already Registered',
    html: `<h4>Email Already Registered</h4>
           <p>Your email <strong>${email}</strong> is already registered.</p>
           ${message}`,
  });
  log.info(`Sent "Email Already Registered" message to ${email}`);
}

export default sendAlreadyRegisteredEmail;
