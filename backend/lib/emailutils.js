const nodemailer = require("nodemailer");
const secretKey = process.env.JWT_SECRET_KEY;
const emailAccessToken = process.env.EMAIL_ACCESS_TOKEN;
const jwt = require("jsonwebtoken");
const officialEmail = process.env.ARCHITECT_EMAIL;
const websiteUrl = process.env.MAIN_WEBSITE_URL;
const fs = require("fs");
const path = require("path");
const templatePath = path.join(__dirname, "../html_content/email.html");
const emailHtmlTemplate = fs.readFileSync(templatePath, "utf-8");

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: officialEmail,
    pass: emailAccessToken,
  },
});

async function sendVerificationEmail(name, email) {
  const token = jwt.sign(
    {
      email,
      date: new Date(),
    },
    secretKey
  );

  const htmlContent = emailHtmlTemplate.replace(
    "{{VERIFICATION_LINK}}",
    `${websiteUrl}/verify-email?token=${token}`
  );

  const receiver = {
    from: officialEmail,
    to: email,
    subject: "Email Verification Link",
    html: htmlContent,
  };

  await transport.sendMail(receiver);
}

module.exports = {
  transport,
  sendVerificationEmail,
};
