"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const unlinkFile = (filename) => {
    try {
        if (typeof filename === "object") {
            filename.map(item => {
                promises_1.default.unlink(`./public/` + item);
            });
            return true;
        }
        else {
            promises_1.default.unlink(`./public/` + filename);
            return true;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.unlinkFile = unlinkFile;
