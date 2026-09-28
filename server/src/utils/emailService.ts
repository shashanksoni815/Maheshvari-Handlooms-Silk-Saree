import nodemailer from 'nodemailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message?: string;
  html?: string;
}

const hasPlaceholder = (value: string | undefined) =>
  !value || /^(your_|change_me|changeme|placeholder|example)|(^|[.@])example\.(com|net|org)($|[.>])/i.test(value.trim());

export const isEmailConfigured = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  return Boolean(
    !hasPlaceholder(process.env.SMTP_HOST) &&
    !hasPlaceholder(process.env.SMTP_USER) &&
    !hasPlaceholder(process.env.SMTP_PASS) &&
    !hasPlaceholder(process.env.FROM_EMAIL) &&
    Number.isInteger(port) && port > 0 && port <= 65535
  );
};

const sendEmail = async (options: SendEmailOptions) => {
  if (!isEmailConfigured()) {
    throw new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and FROM_EMAIL.');
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Maheshwari Handlooms'} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
