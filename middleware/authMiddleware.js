const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    throw new Error({
      message: "Your not authorized",
      statusCode: 401,
    });
  }

  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
  try {
  } catch (err) {
    throw new Error({
      message: "Invalid token, not authorized",
      statusCode: 401,
    });
  }
};

module.exports = verifyToken;
