import nodemailer from 'nodemailer';

async function sendEmail({ to, subject, html, from = process.env.SMTP_FROM }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({ from, to, subject, html });
}

export default sendEmail;
