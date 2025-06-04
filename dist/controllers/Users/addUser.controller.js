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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const __1 = require("../..");
const addUser_1 = require("../../schema/user/addUser");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (req.user.role === "ADMIN") {
            const userDetails = addUser_1.SignUpSchema.parse(req.body);
            const user = yield __1.prismaClient.user.create({
                data: {
                    fullName: userDetails.fullName,
                    gender: userDetails.gender,
                    email: userDetails.email,
                    phone: userDetails.phone,
                    role: userDetails.role,
                    createdBy: req.user.userId,
                },
            });
            return res.json({ Message: "User create successfully", user });
        }
        else {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (err) {
        console.log(err);
        if (err.code === "P2002") {
            if ((_b = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("phone")) {
                return next(new bad_request_1.BadRequestsException("Phone number already registered with different user", root_1.ErrorCode.USER_ALREADY_EXISTS));
            }
            else if ((_d = (_c = err.meta) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.includes("email")) {
                return next(new bad_request_1.BadRequestsException("Email already registered with different user", root_1.ErrorCode.USER_ALREADY_EXISTS));
            }
        }
        else {
            return next(new bad_request_1.BadRequestsException(err === null || err === void 0 ? void 0 : err.message, root_1.ErrorCode.UNPROCESSABLE_ENTITY));
        }
    }
});
exports.addUser = addUser;
