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
const __1 = require("..");
const otp_service_1 = __importDefault(require("../services/otp/otp.service"));
describe('OTP Service', () => {
    const identifier = 'test@example.com';
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clear Redis before each test to avoid state leakage
        yield __1.redis.flushall();
    }));
    it('should generate and verify OTP successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const otp = yield otp_service_1.default.generateAndStoreOTP(identifier);
        expect(otp).toBeDefined();
        const result = yield otp_service_1.default.verifyOTP(identifier, otp);
        expect(result).toBe(true);
    }));
    it('should reject invalid OTP', () => __awaiter(void 0, void 0, void 0, function* () {
        yield otp_service_1.default.generateAndStoreOTP(identifier);
        const result = yield otp_service_1.default.verifyOTP(identifier, '000000');
        expect(result).toBe(false);
    }));
    it('should allow generating multiple OTPs without cooldown', () => __awaiter(void 0, void 0, void 0, function* () {
        const otp1 = yield otp_service_1.default.generateAndStoreOTP(identifier);
        expect(otp1).toBeDefined();
        const otp2 = yield otp_service_1.default.generateAndStoreOTP(identifier);
        expect(otp2).toBeDefined();
        expect(otp2).not.toEqual(otp1);
    }));
    it('should lock out after max failed attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        const otp = yield otp_service_1.default.generateAndStoreOTP(identifier);
        for (let i = 0; i < 5; i++) {
            yield otp_service_1.default.verifyOTP(identifier, 'wrongotp');
        }
        // OTP should be deleted after 5 failed attempts
        const result = yield otp_service_1.default.verifyOTP(identifier, otp);
        expect(result).toBe(false);
    }));
});
