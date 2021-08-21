"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("../models/app.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    if (yield app_js_1.default.findOne({ email })) {
        return res.status(400).json({
            status: "error",
            errorType: "email",
            message: "Email already exists",
        });
    }
    const genSalt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, genSalt);
    const user = { email, password: hashedPassword };
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    app_js_1.default.create(user)
        .then((_data) => {
        res.json({ status: "success", message: "Account successfully created" });
    })
        .catch((err) => {
        res.json({
            status: "error",
            message: err.message || "error while creating account",
        });
    });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield app_js_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "error",
                errorType: "email",
                message: "Email not found",
            });
        }
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(400).json({
                status: "Error",
                errorType: "password",
                message: "Incorrect password",
            });
            return;
        }
    }
    catch (err) {
        res
            .status(400)
            .json({ status: "error", message: err.message || "Error while login" });
    }
    const token = jsonwebtoken_1.default.sign({
        exp: Math.floor(Date.now() / 1000) + 5 * 60,
        data: { email, role: "Manager" },
    }, process.env.JWT_SECRET);
    res
        .status(200)
        .cookie("token", token, {
        // exp: Math.floor(Date.now() / 1000) + 5 * 60, //seconds
        maxAge: 60 * 5 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: true,
    })
        .json({ status: "success", message: "Login successful" });
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield app_js_1.default.find();
        res.status(200).json({ status: "success", data: users });
    }
    catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message || "Error while getting all users",
        });
    }
});
const checkToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ status: "error", message: "Login required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // req["data"] = decoded.data;
    }
    catch (err) {
        res.status(401).json({
            status: "error",
            message: err.message || "Cookie expired",
        });
        return;
    }
    next();
};
exports.default = { login, signup, checkToken, getAllUsers };
