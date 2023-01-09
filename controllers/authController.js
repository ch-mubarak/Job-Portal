const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(email && password && name)) {
    return res.status(401).json({ message: "All fields are required" });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(401).json({ message: "User already exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  user.password = undefined;
  const token = generateToken(newUser);
  res.status(201).json({ user, token });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email && password) {
    return res.status(401).json({ message: "All fields are required" });
  }
  try {
    const user = await User.find({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      user.password = undefined;
      const token = generateToken(user);
      return res.status(200).json({ user, token });
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
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
