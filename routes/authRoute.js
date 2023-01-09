const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");

const route = express.Router();

route.post("/login", loginUser);
route.post("/register", registerUser);
module.exports = route;
