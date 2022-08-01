import logger from 'pino';
const log = logger();

import sendEmail from './sendEmail';

async function sendAlreadyRegisteredEmail(user) {
  let message;
  // if (origin) {
  //   message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
  // } else {
  //   message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  // }

  await sendEmail({
    to: user.email,
    subject: 'Email Already Registered',
    html: `<h4>Email Already Registered</h4>
           <p>Hello ${user.firstname},</p>
           <p>we received a request for a new account with this email address (${user.email}): an account already exists.</p>
           <p>If this was you, please use the following link to reset your password so to regain access to your account: [WIP]</p>
           <p>Thanks!</p>`,
  });

  log.info(`Sent "Email Already Registered" message to ${user.email}`);
}

export default sendAlreadyRegisteredEmail;
