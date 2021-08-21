import { NextFunction, Request, Response } from "express";

import UserModel from "../models/app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

const signup = async (req: Request, res: Response) => {
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

  const user = { email, password: hashedPassword } as User;

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
    .catch((err: Error) => {
      res.json({
        status: "error",
        message: err.message || "error while creating account",
      });
    });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: any = await UserModel.findOne({ email });

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
      sameSite: true,
    })
    .json({ status: "success", message: "Login successful" });
};

const getAllUsers = async (req: Request, res: Response) => {
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

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ status: "error", message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req["data"] = decoded.data;
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: err.message || "Cookie expired",
    });

    return;
  }
  next();
};

export default { login, signup, checkToken, getAllUsers };
