const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const csurf = require("csurf");

const { login, signup, getAllUsers, checkToken } = require("./controllers/app");


// middleweres
app.use(express.json());
app.use(cookieParser());
require("dotenv").config({ path: "./.env" });

const corsOpt = {
  origin: "*", // this work well to configure origin url in the server
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // to works well with web app, OPTIONS is required
  credentials: true,
};
app.use(cors(corsOpt)); // cors for all the routes of the application
app.options("*", cors(corsOpt));
const csrfProtection = csurf({
  cookie: true
});

// routes
app.post("/signup", signup);

app.post("/login", login);

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/users", checkToken, csrfProtection, getAllUsers);

// mongoose connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((err) =>
    console.log(err.message || "error while connecting to MongoDB")
  );

// start the server
app.listen(8000, () => console.log("listening to port 8000"));
