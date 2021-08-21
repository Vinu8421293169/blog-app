"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("blog", new mongoose_1.default.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        max: 255,
        min: 6,
        unique: true,
        validate: {
            validator: (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
            message: "{VALUE} is not a valid email",
            isAsync: false,
        },
    },
    password: {
        type: String,
        required: true,
    },
    // contactNum: {
    //   type: Number,
    // },
    date: {
        type: Date,
        default: Date.now,
    },
}));
