const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email - Eslam Store',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #000;
            }
            .otp-box {
              background-color: #000;
              color: #fff;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
              margin: 30px 0;
            }
            .message {
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Eslam Store</div>
            </div>
            
            <h2>Verify Your Email Address</h2>
            
            <div class="message">
              <p>Dear ${name},</p>
              <p>Thank you for registering at Eslam Store. To complete your registration, please verify your email address by entering the following One-Time Password (OTP):</p>
            </div>
            
            <div class="otp-box">${otp}</div>
            
            <div class="warning">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this verification, please ignore this email</li>
              </ul>
            </div>
            
            <div class="message">
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br>The Eslam Store Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Eslam Store. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send Welcome Email (after verification)
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Eslam Store!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #000;
            }
            .button {
              display: inline-block;
              background-color: #000;
              color: #fff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Eslam Store</div>
            </div>
            
            <h2>Welcome to Eslam Store!</h2>
            
            <p>Dear ${name},</p>
            
            <p>Your email has been successfully verified. Your account is now active and ready to use!</p>
            
            <p>Start shopping and enjoy our amazing products and exclusive deals.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping</a>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Eslam Store Team</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} Eslam Store. All rights reserved.<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
