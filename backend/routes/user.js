const { default: PrismaClientManager } = require("../lib/pgConnect");
const { statusCodes } = require("../lib/types/statusCodes");
const userRouter = require("express").Router();
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const prisma = PrismaClientManager.getInstance().getPrismaClient();

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, secretKey);
    const { id, email } = jwt.decode(token);
    req.headers.id = id;
    req.headers.email = email;
  } catch {
    return res.json({
      status: statusCodes.UNAUTHORIZED,
    });
  }

  next();
}

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
    console.log(e);
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
});

module.exports = {
  userRouter,
};
