import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_TLS_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendActivationMail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Account activation for ${process.env.API_URL}`,
    text: '',
    html: `
                    <div>
                        <h1>To activate follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
  });
};
