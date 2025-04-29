"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorMiddleware = (error, req, res, next) => {
    logger_1.default.error(`${error.message} - ${req.method} ${req.originalUrl}`);
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    });
};
exports.errorMiddleware = errorMiddleware;
