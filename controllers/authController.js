const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!(email && password && name)) {
      res.status(401);
      throw new Error("All fields are required");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(401);
      throw new Error("User already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    user.password = undefined;
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(401);
      throw new Error("All fields are required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      user.password = undefined;
      const token = generateToken(user);
      return res.status(200).json({ user, token });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

module.exports = {
  loginUser,
  registerUser,
};
