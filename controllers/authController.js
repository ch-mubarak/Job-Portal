const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


//@des Register user
//@route POST /api/auth
//@access Public
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
    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

//@des Register user
//@route POST /api/auth
//@access Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(401);
      throw new Error("All fields are required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      user.password = undefined;
      return res.status(200).json({ user, token });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
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
