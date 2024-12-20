const { default: PrismaClientManager } = require("../lib/pgConnect");
const { statusCodes } = require("../lib/types/statusCodes");
const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const prisma = PrismaClientManager.getInstance().getPrismaClient();
const officialEmail = process.env.ARCHITECT_EMAIL;
const { transport } = require("../lib/emailutils");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const fs = require("fs");
const path = require("path");
const templatePath = path.join(__dirname, "../html_content/otp.html");
const forgetPassHtmlTemplate = fs.readFileSync(templatePath, "utf-8");

async function sendForgetPassOTP(email, otp) {
  const htmlContent = forgetPassHtmlTemplate.replace("{{OTP_CODE}}", otp);

  const receiver = {
    from: officialEmail,
    to: email,
    subject: "Password Reset: OTP Verification Code",
    html: htmlContent,
  };

  await transport.sendMail(receiver);
}

authRouter.post("/forget_pass", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return res.json({ status: statusCodes.BAD_REQUEST });
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    // send otp
    await sendForgetPassOTP(email, otpCode);
    const hashString = `${email}@${otpCode}`;
    const hashed = await bcrypt.hash(hashString, 10);

    return res.json({ status: statusCodes.OK, token: hashed });
  } catch (e) {
    console.log(e);
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

authRouter.post("/verify_otp", async (req, res) => {
  const { email, token, otp } = req.body;
  const hashString = `${email}@${otp}`;

  if (bcrypt.compare(hashString, token)) {
    return res.json({ status: statusCodes.OK });
  }

  return res.json({ status: statusCodes.UNAUTHORIZED });
});

authRouter.post("/reset_pass", async (req, res) => {
  const { email, token, otp, password } = req.body;
  try {
    const hashString = `${email}@${otp}`;
    if (bcrypt.compare(hashString, token)) {
      const hashedPass = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          hashedPass,
        },
      });
      return res.json({ status: statusCodes.OK });
    }

    return res.json({ status: statusCodes.UNAUTHORIZED });
  } catch {
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

authRouter.post("/verify_email", async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, secretKey);
  } catch {
    return res.json({ status: statusCodes.UNAUTHORIZED });
  }

  try {
    const { email } = jwt.decode(token);
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    // if(!user) res.json({ status: statusCodes.BAD_REQUEST });
    if (user.hasAccess) {
      return res.json({ status: statusCodes.BAD_REQUEST });
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        hasAccess: true,
      },
    });

    return res.json({ status: statusCodes.OK });
  } catch {
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

module.exports = {
  authRouter,
};
