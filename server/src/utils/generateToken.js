"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secret', {
        expiresIn: '1d', // 1 day
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_REFRESH_SECRET || 'refreshSecret', {
        expiresIn: '7d', // 7 days
    });
    return { accessToken, refreshToken };
};
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map