"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const csurf_1 = __importDefault(require("csurf"));
const app = express_1.default();
const app_1 = __importDefault(require("./controllers/app"));
// middleweres
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
require("dotenv").config({ path: "./.env" });
const corsOpt = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};
app.use(cors_1.default(corsOpt));
// app.options("*", cors(corsOpt));
const csrfProtection = csurf_1.default({
    cookie: true,
});
// routes
app.post("/signup", app_1.default.signup);
app.post("/login", app_1.default.login);
app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
app.get("/users", app_1.default.checkToken, csrfProtection, app_1.default.getAllUsers);
// mongoose connection
mongoose_1.default
    .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => console.log(err.message || "error while connecting to MongoDB"));
// start the server
app.listen(8000, () => console.log("listening to port 8000"));
/*
MONGODB_URI=mongodb+srv://vinu:TEMfLEwrKiUhs7M4@blog-app.rmvka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
*/
