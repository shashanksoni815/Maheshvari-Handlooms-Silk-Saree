import nodemailer from 'nodemailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message?: string;
  html?: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
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
