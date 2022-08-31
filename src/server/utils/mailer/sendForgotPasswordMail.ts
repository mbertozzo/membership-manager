import logger from 'pino';
const log = logger();

import sendEmail from './sendEmail';

async function sendForgotPasswordMail(user) {
  let message;
  // if (origin) {
  //   message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
  // } else {
  //   message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  // }

  await sendEmail({
    to: user.email,
    subject: 'Reset Password',
    html: `<h4>Reset Password</h4>
           <p>Hello ${user.firstname},</p>
           <p>we received a request for a password reset.</p>
           <!--<p>If this was you, please use the following link to reset your password so to regain access to your account: [WIP]</p>-->
           <p>Please, use the following code to reset your password:</p>
           <p><code>${user.resetToken}</code></p>
           <p>Thanks!</p>`,
  });

  log.info(`Sent "Password Reset" message to ${user.email}`);
}

export default sendForgotPasswordMail;
