"use strict";
//message, status code, error codes, error
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, errors) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
exports.HttpException = HttpException;
var ErrorCode;
(function (ErrorCode) {
    // ───────────────────────────────
    // HTTP Standard Error Codes
    // ───────────────────────────────
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    // ───────────────────────────────
    // 1xxx: User-related Errors
    // ───────────────────────────────
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 1001] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 1002] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["INCORRECT_PASSWORD"] = 1003] = "INCORRECT_PASSWORD";
    ErrorCode[ErrorCode["INVALID_INPUT"] = 1004] = "INVALID_INPUT";
    // ───────────────────────────────
    // 2xxx: Validation / Business Rule Errors
    // ───────────────────────────────
    ErrorCode[ErrorCode["UNPROCESSABLE_ENTITY"] = 2001] = "UNPROCESSABLE_ENTITY";
    ErrorCode[ErrorCode["MEMBER_ALREADY_EXISTS"] = 2002] = "MEMBER_ALREADY_EXISTS";
    // ───────────────────────────────
    // 3xxx: System / Internal Errors
    // ───────────────────────────────
    ErrorCode[ErrorCode["INTERNAL_EXCEPTION"] = 3001] = "INTERNAL_EXCEPTION";
    // ───────────────────────────────
    // 4xxx: Member-related Errors
    // ───────────────────────────────
    // MEMBER_NOT_FOUND = 4001,
    ErrorCode[ErrorCode["NO_DATA_PROVIDED"] = 4002] = "NO_DATA_PROVIDED";
    // ───────────────────────────────
    // 5xxx: General Errors
    // ───────────────────────────────
    ErrorCode[ErrorCode["SERVER_ERROR"] = 5000] = "SERVER_ERROR";
    ErrorCode[ErrorCode["BAD_REQUEST"] = 5001] = "BAD_REQUEST";
    ErrorCode[ErrorCode["NOT_FOUND"] = 5002] = "NOT_FOUND";
    ErrorCode[ErrorCode["FORBIDDEN"] = 5003] = "FORBIDDEN";
    ErrorCode[ErrorCode["CONFLICT"] = 5004] = "CONFLICT";
    ErrorCode[ErrorCode["TIMEOUT"] = 5005] = "TIMEOUT";
    ErrorCode[ErrorCode["SERVICE_UNAVAILABLE"] = 5006] = "SERVICE_UNAVAILABLE";
    ErrorCode[ErrorCode["GATEWAY_TIMEOUT"] = 5007] = "GATEWAY_TIMEOUT";
    ErrorCode[ErrorCode["INVALID_CREDENTIALS"] = 5008] = "INVALID_CREDENTIALS";
    ErrorCode[ErrorCode["INVALID_TOKEN"] = 5009] = "INVALID_TOKEN";
    ErrorCode[ErrorCode["TOKEN_EXPIRED"] = 5010] = "TOKEN_EXPIRED";
    ErrorCode[ErrorCode["INVALID_API_KEY"] = 5011] = "INVALID_API_KEY";
    ErrorCode[ErrorCode["API_RATE_LIMIT_EXCEEDED"] = 5012] = "API_RATE_LIMIT_EXCEEDED";
    ErrorCode[ErrorCode["INVALID_REQUEST"] = 5013] = "INVALID_REQUEST";
    ErrorCode[ErrorCode["INVALID_RESPONSE"] = 5014] = "INVALID_RESPONSE";
    ErrorCode[ErrorCode["DATABASE_ERROR"] = 5015] = "DATABASE_ERROR";
    ErrorCode[ErrorCode["NETWORK_ERROR"] = 5016] = "NETWORK_ERROR";
    ErrorCode[ErrorCode["OTP_GENERATION_FAILED"] = 5017] = "OTP_GENERATION_FAILED";
    ErrorCode[ErrorCode["OTP_VERIFICATION_FAILED"] = 5018] = "OTP_VERIFICATION_FAILED";
    ErrorCode[ErrorCode["DUPLICATE_ENTRY"] = 5019] = "DUPLICATE_ENTRY";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
