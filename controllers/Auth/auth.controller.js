"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyOTP = exports.requestOTP = exports.signUp = void 0;
const __1 = require("../..");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../../secrets");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const users_1 = require("../../schema/users");
const otp_service_1 = __importDefault(require("../../services/otp/otp.service"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role === "ADMIN") {
            const userDetails = users_1.SignUpSchema.parse(req.body);
            let user = yield __1.prismaClient.user.findFirst({
                where: { phone: userDetails.phone },
            });
            if (user) {
                next(new bad_request_1.BadRequestsException("User already exists", root_1.ErrorCode.USER_ALREADY_EXISTS));
            }
            user = yield __1.prismaClient.user.create({
                data: {
                    fullName: userDetails.fullName,
                    gender: userDetails.gender,
                    email: userDetails.email,
                    phone: userDetails.phone,
                    role: userDetails.role,
                    createdBy: req.user.userId,
                },
            });
            res.json({ Message: "User create successfully", user });
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (err) {
        console.log(err);
        next(
        // new UnprocessableEntity(
        //   err?.issues,
        //   "Unprocessable Entity",
        //   ErrorCode.UNPROCESSABLE_ENTITY
        // )
        new bad_request_1.BadRequestsException(err === null || err === void 0 ? void 0 : err.message, root_1.ErrorCode.UNPROCESSABLE_ENTITY));
    }
});
exports.signUp = signUp;
// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body;
//   let user = await prismaClient.user.findFirst({ where: { email } });
//   if (!user) {
//     throw Error("User does not exist!");
//   }
//   if (!compareSync(password, user.passwordHash)) {
//     throw Error("Incorrect password");
//   }
//   const token = jwt.sign(
//     {
//       userId: user.id,
//     },
//     JWT_SECRET
//   );
//   res.json({ user, token });
// };
const requestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    try {
        let user = yield __1.prismaClient.user.findFirst({ where: { phone } });
        const identifier = phone;
        if (!identifier) {
            next(new bad_request_1.BadRequestsException("Invalid Number", root_1.ErrorCode.INVALID_INPUT));
        }
        if (!user) {
            next(new bad_request_1.BadRequestsException("User not registered", root_1.ErrorCode.USER_NOT_FOUND));
        }
        // const otp = otpService.generateOTP();
        // otpService.storeOTP(identifier, otp);
        const otp = yield otp_service_1.default.generateAndStoreOTP(identifier);
        if (!otp) {
            return next(new bad_request_1.BadRequestsException("Please wait for a min before requesting another OTP.", root_1.ErrorCode.OTP_GENERATION_FAILED));
        }
        console.log(`Generated OTP for ${identifier}: ${otp}`);
        // sendMsg();
        return res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        next(new bad_request_1.BadRequestsException("Failed to send OTP", root_1.ErrorCode.OTP_GENERATION_FAILED));
    }
});
exports.requestOTP = requestOTP;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    const identifier = phone;
    if (!identifier || !otp) {
        next(new bad_request_1.BadRequestsException("Invalid request", root_1.ErrorCode.INCORRECT_PASSWORD));
    }
    const isValid = yield otp_service_1.default.verifyOTP(identifier, otp);
    if (!isValid) {
        next(new bad_request_1.BadRequestsException("Invalid or expired OTP", root_1.ErrorCode.INCORRECT_PASSWORD));
    }
    let user = yield __1.prismaClient.user.findFirst({ where: { phone } });
    const token = jwt.sign({
        userId: user === null || user === void 0 ? void 0 : user.id,
        role: user === null || user === void 0 ? void 0 : user.role,
        phone: user === null || user === void 0 ? void 0 : user.phone,
    }, secrets_1.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ user, token, message: "OTP verified successfully" });
});
exports.verifyOTP = verifyOTP;
