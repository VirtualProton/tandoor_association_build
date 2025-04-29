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
exports.sendOtpIfEditor = void 0;
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const otp_service_1 = __importDefault(require("../services/otp/otp.service"));
const sendOtpIfEditor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (["TSMWA_EDITOR", "TQMA_EDITOR"].includes(req.user.role)) {
            yield otp_service_1.default.generateAndStoreOTP(req.user.phone);
        }
        next(); // Call next() to proceed to the next middleware
    }
    catch (error) {
        return next(new bad_request_1.BadRequestsException("Error sending OTP", root_1.ErrorCode.OTP_GENERATION_FAILED));
    }
});
exports.sendOtpIfEditor = sendOtpIfEditor;
