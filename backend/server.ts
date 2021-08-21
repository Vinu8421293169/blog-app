import express, { Application } from "express";

import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
import csurf from "csurf";
const app: Application = express();

import appRoute from "./controllers/app";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
    }
  }
}
// middleweres
app.use(express.json());
app.use(cookieParser());
require("dotenv").config({ path: "./.env" });

const corsOpt: CorsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  preflightContinue: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};
app.use(cors(corsOpt));
// app.options("*", cors(corsOpt));
const csrfProtection = csurf({
  cookie: true,
});

// routes
app.post("/signup", appRoute.signup);

app.post("/login", appRoute.login);

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/users", appRoute.checkToken, csrfProtection, appRoute.getAllUsers);

// mongoose connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((err: { message: any }) =>
    console.log(err.message || "error while connecting to MongoDB")
  );

// start the server
app.listen(8000, () => console.log("listening to port 8000"));

/*
MONGODB_URI=mongodb+srv://vinu:TEMfLEwrKiUhs7M4@blog-app.rmvka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
*/
