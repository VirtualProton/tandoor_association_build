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
const crypto_1 = __importDefault(require("crypto"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(); // Connect to Redis server
// OTPService class to handle OTP generation, storage, and verification
class OTPService {
    constructor() {
        this.OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes in seconds
        this.MAX_ATTEMPTS = 5; // Max attempts before lockout
    }
    getOTPKey(identifier) {
        return `otp:${identifier}`;
    }
    getAttemptsKey(identifier) {
        return `otp_attempts:${identifier}`;
    }
    generateOTP() {
        return crypto_1.default.randomInt(100000, 999999).toString();
    }
    generateAndStoreOTP(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOTP();
            // Store OTP with expiry
            yield redis.set(this.getOTPKey(identifier), otp, "PX", this.OTP_EXPIRY_MS);
            // Reset attempt counter
            yield redis.del(this.getAttemptsKey(identifier));
            return otp;
        });
    }
    verifyOTP(identifier, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield redis.get(this.getOTPKey(identifier));
            const attemptKey = this.getAttemptsKey(identifier);
            if (!storedOtp)
                return false;
            if (storedOtp !== otp) {
                const attempts = parseInt((yield redis.get(attemptKey)) || "0", 10);
                if (attempts + 1 >= this.MAX_ATTEMPTS) {
                    // Exceeded max attempts - block or delete OTP
                    yield redis.del(this.getOTPKey(identifier));
                    yield redis.del(attemptKey);
                }
                else {
                    yield redis.set(attemptKey, (attempts + 1).toString(), "PX", this.OTP_EXPIRY_MS);
                }
                return false;
            }
            // Success: delete OTP and attempts
            yield redis.del(this.getOTPKey(identifier));
            yield redis.del(attemptKey);
            return true;
        });
    }
    invalidateOTP(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis.del(this.getOTPKey(identifier));
            yield redis.del(this.getAttemptsKey(identifier));
        });
    }
}
exports.default = new OTPService();
