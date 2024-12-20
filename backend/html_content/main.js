const forgetPassOTPHtmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid #e3e3e3;
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        color: #2c3e50;
        font-size: 24px;
      }
      .otp-box {
        text-align: center;
        margin: 30px 0;
      }
      .otp-box h2 {
        font-size: 28px;
        color: #3498db;
        margin: 0;
      }
      .content {
        font-size: 16px;
        color: #7f8c8d;
        line-height: 1.6;
        text-align: center;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #bdc3c7;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Architect Developers</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Please use the OTP code below to verify your identity:</p>
      </div>
      <div class="otp-box">
        <h2>{{OTP_CODE}}</h2>
      </div>
      <div class="content">
        <p>If you didn’t request this code, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Architect Developers. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const emailVerificationHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f9;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        color: #333;
        font-size: 24px;
        margin: 0;
      }
      .message-box {
        text-align: center;
        margin: 20px 0;
      }
      .message-box h2 {
        font-size: 20px;
        color: #007bff;
        margin: 0 0 10px;
      }
      .content {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
        text-align: center;
        margin-bottom: 20px;
      }
      .verify-button {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 12px 24px;
        font-size: 16px;
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
      }
      .verify-button:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #aaa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Our Platform</h1>
      </div>
      <div class="content">
        <p>Hi {{USER_NAME}},</p>
        <p>Thank you for signing up! Please click the button below to verify your email address and activate your account:</p>
      </div>
      <div class="message-box">
        <a href="{{VERIFICATION_LINK}}" class="verify-button">Verify Email</a>
      </div>
      <div class="content">
        <p>If you didn’t sign up for this account, please disregard this message.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Timetable Architect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

module.exports = {
    forgetPassOTPHtmlContent,
    emailVerificationHtml
}