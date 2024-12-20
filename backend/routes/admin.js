const { default: PrismaClientManager } = require("../lib/pgConnect");
const { statusCodes } = require("../lib/types/statusCodes");
const jwt = require("jsonwebtoken");
const adminRouter = require("express").Router();
const prisma = PrismaClientManager.getInstance().getPrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

const fs = require("fs");
const path = require("path");
const templatePath = path.join(__dirname, "../html_content/access.html");
const accessTemplate = fs.readFileSync(templatePath, "utf-8");
const officialEmail = process.env.ARCHITECT_EMAIL;
const emailAccessToken = process.env.EMAIL_ACCESS_TOKEN;
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: officialEmail,
    pass: emailAccessToken,
  },
});

async function accessEmailSend(name, org, email) {
  let htmlContent = accessTemplate;
  htmlContent = htmlContent.replace("{{name}}", name);
  htmlContent = htmlContent.replace("{{organisation_name}}", org);
  htmlContent = htmlContent.replace('[LOGIN_URL]',process.env.MAIN_WEBSITE_URL + "/signin")
  const receiver = {
    from: officialEmail,
    to: email,
    subject: "Access Granted !!",
    html: htmlContent,
  };

  await transport.sendMail(receiver);
}

async function adminMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { id, email } = jwt.decode(token);
    req.headers.id = id;
    req.headers.email = email;

    jwt.verify(token, secretKey);
  } catch {
    return res.json({
      status: statusCodes.UNAUTHORIZED,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.headers.id,
      },
    });

    if (user.role != "admin") {
      return res.json({
        status: statusCodes.UNAUTHORIZED,
      });
    }
    req.headers.orgId = user.orgId;
    next();
  } catch {
    return res.json({
      status: statusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// get a list of access requests
adminRouter.get("/get_access_requests", adminMiddleware, async (req, res) => {
  try {
    const data = await prisma.accessRequest.findMany({
      where: {
        orgId: req.headers.orgId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({ status: statusCodes.OK, data });
  } catch {
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

// change access of user on organisation
adminRouter.post("/change_access", adminMiddleware, async (req, res) => {
  const { access } = req.body;
  const access_id = Number(req.body.access_id);

  try {
    if (access) {
      const access_request = await prisma.accessRequest.findFirst({
        where: {
          id: access_id,
        },
        include: {
          organisation: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      await accessEmailSend(
        access_request.user.name,
        access_request.organisation.name,
        access_request.user.email
      );

      await prisma.user.update({
        where: {
          id: access_request.userId,
        },
        data: {
          orgId: access_request.organisation.id,
          department: access_request.department,
          role: access_request.level,
        },
      });
    }

    await prisma.accessRequest.delete({
      where: {
        id: access_id,
      },
    });

    return res.json({
      status: statusCodes.OK,
    });
  } catch (e) {
    console.log(e);
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

module.exports = {
  adminRouter,
};
