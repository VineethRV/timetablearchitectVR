const jwt = require("jsonwebtoken");
const { statusCodes } = require("../lib/types/statusCodes");
const secretKey = process.env.JWT_SECRET_KEY;

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, secretKey);
    const { id, email } = jwt.decode(token);
    req.headers.id = id;
    req.headers.email = email;
  } catch(e) {
    return res.json({
      status: statusCodes.UNAUTHORIZED,
    });
  }

  next();
}

module.exports = {
  checkAuth,
};
