const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Your not authorized");
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Your not authorized");
    }
    req.user = { userId: user.id, email: user.email };
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
};

module.exports = verifyToken;
