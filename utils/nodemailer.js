import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// using nodemailer to send verification email to the user
const verifyEmail = async (email, link) => {
  try {
    // create transport for the mail here
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: process.env.SECURE,
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: 'Verify Email',
      text: 'Welcome',
      html: `
      <div>
      <p>Thank you for registering on our website. Please verify your account to have full access to your account. This link expires in 30 mins</p>
      <a href=${link}>Click Here to verify your email</a>
      </div>
      `,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// using nodemailer to send notification email to the user
const notificationEmail = async (email, title) => {
  try {
    // create transport for the mail here
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: process.env.SECURE,
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: 'Notification Email',
      text: 'Reminder',
      html: `
      <div>
      <p>This is to remind you that your task with title: ${title} will start in 15minutes time</p>
      
      </div>
      `,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

export { verifyEmail, notificationEmail };
