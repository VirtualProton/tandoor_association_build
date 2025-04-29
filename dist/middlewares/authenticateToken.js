"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new bad_request_1.BadRequestsException("Token expired", root_1.ErrorCode.TOKEN_EXPIRED));
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new bad_request_1.BadRequestsException("Invalid token", root_1.ErrorCode.INVALID_TOKEN));
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
    return;
};
exports.authenticateToken = authenticateToken;
