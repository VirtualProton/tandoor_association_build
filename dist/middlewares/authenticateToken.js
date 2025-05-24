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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const index_1 = require("../index");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET);
        console.log(decoded);
        // Check if user exists in Redis
        const cacheKey = `user:phone:${decoded.phone}`;
        const cachedUser = yield index_1.redis.get(cacheKey);
        if (!cachedUser) {
            return next(new bad_request_1.BadRequestsException("Wrong token, please re-login", root_1.ErrorCode.UNAUTHORIZED));
        }
        const userObj = JSON.parse(cachedUser);
        // console.log(userObj);
        if (userObj != decoded.userId) {
            return next(new bad_request_1.BadRequestsException("Wrong token, please re-login", root_1.ErrorCode.UNAUTHORIZED));
        }
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
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
    return;
});
exports.authenticateToken = authenticateToken;
function getAllCachedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = yield index_1.redis.keys("user:phone:*");
        if (keys.length === 0) {
            return []; // nothing to fetch
        }
        const values = yield index_1.redis.mget(...keys);
        const result = keys.map((key, index) => ({
            phone: key.split(":")[2], // extract phone from key
            userId: values[index],
        }));
        return result;
    });
}
