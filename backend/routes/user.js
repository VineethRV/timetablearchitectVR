const { default: PrismaClientManager } = require("../lib/pgConnect");
const { statusCodes } = require("../lib/types/statusCodes");
const userRouter = require("express").Router();
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const { checkAuth } = require("../middlewares/checkAuth");
const prisma = PrismaClientManager.getInstance().getPrismaClient();

userRouter.get("/check_org", checkAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.headers.id,
    },
    select: {
      orgId: true,
    },
  });

  if (!user || !user.orgId) {
    return res.json({ result: false });
  }

  return res.json({ result: true });
});

userRouter.post("/request_access", checkAuth, async (req, res) => {
  const { invite_code, level, department } = req.body;

  try {
    const organisation = await prisma.organisation.findFirst({
      where: {
        invite_code,
      },
      select: {
        id: true,
      },
    });
    
    if (!organisation) return res.json({ status: statusCodes.BAD_REQUEST });

    const access_req = await prisma.accessRequest.findFirst({
      where: {
        userId: req.headers.id,
        orgId: organisation.id,
      },
    });

    if (access_req) return res.json({ status: statusCodes.BAD_REQUEST });

    await prisma.accessRequest.create({
      data: {
        userId: req.headers.id,
        orgId: organisation.id,
        level,
        department,
      },
    });

    return res.json({
      status: statusCodes.OK,
    });
  } catch (e) {
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

module.exports = {
  userRouter,
};
