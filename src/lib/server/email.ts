import { createTransport } from 'nodemailer';

import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from '$env/static/private';

const transporter = createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
    text,
  });
}
