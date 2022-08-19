const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authorize = require("../middlewares/authorize");
const { AUTH_COOKIE_NAME, TOKEN_KEY } = require("../middlewares/authorize");
const { ONE_DAY } = require("../helpers");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // sanitize
    [firstName, lastName, email, password] = [
      firstName?.trim(),
      lastName?.trim(),
      email?.trim().toLowerCase(),
      password?.trim(),
    ];

    if (!(email && password && firstName && lastName)) {
      return res.status(400).json("Invalid request");
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json("User Already Exists. Please Login");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    newUser.save();

    res.status(201).json("Registered successfully");
  } catch (error) {
    console.log(error);

    res.status(500).json("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // sanitize
    [email, password] = [email?.trim().toLowerCase(), password?.trim()];

    if (!(email && password)) {
      return res.status(400).json("Invalid request");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json("Email or password is incorrect");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json("Email or password is incorrect");
    }

    const token = jwt.sign({ userId: user._id }, TOKEN_KEY, {
      expiresIn: "1d",
    });

    res
      .cookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ONE_DAY,
      })
      .status(200)
      .json("Logged in successfully");
  } catch (error) {
    console.log(error);

    res.status(500).json("Server error");
  }
});

router.get("/logout", authorize, (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME).status(200).json("Logged out successfully");
});

module.exports = router;
