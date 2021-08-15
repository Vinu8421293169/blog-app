const UserModel = require("../models/app.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (await UserModel.findOne({ email })) {
    return res.status(400).json({
      status: "error",
      errorType: "email",
      message: "Email already exists",
    });
  }

  const genSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, genSalt);

  const user = { email, password: hashedPassword };

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  UserModel.create(user)
    .then((_data) => {
      res.json({ status: "success", message: "Account successfully created" });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: err.message || "error while creating account",
      });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
  //   return res.status(200).json({ status: "error", message: "Invalid email" });
  // }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        errorType: "email",
        message: "Email not found",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(400).json({
        status: "Error",
        errorType: "password",
        message: "Incorrect password",
      });
      return;
    }
  } catch (err) {
    res
      .status(400)
      .json({ status: "error", message: err.message || "Error while login" });
  }

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 5 * 60, //seconds
      data: { email, role: "Manager" },
    },
    process.env.JWT_SECRET
  );

  res
    .status(200)
    .cookie("token", token, {
      // exp: Math.floor(Date.now() / 1000) + 5 * 60, //seconds
      maxAge: 60 * 5 * 1000, //miliseconds
      httpOnly: true,
      secure: true,
      samesite: true,
    })
    .json({ status: "success", message: "Login successful" });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ status: "success", data: users });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message || "Error while getting all users",
    });
  }
};

const checkToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ status: "error", message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.data = decoded.data;
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: err.message || "Cookie expired",
    });

    return;
  }
  next();
};

module.exports = { login, signup, checkToken, getAllUsers };
