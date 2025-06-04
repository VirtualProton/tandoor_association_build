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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateUser_1 = require("../../schema/user/updateUser");
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (req.user.role === "ADMIN") {
            const userDetails = updateUser_1.updateUserSchema.parse(req.body);
            const { id } = userDetails, updateUser = __rest(userDetails, ["id"]);
            const updatedUserData = yield __1.prismaClient.user.update({
                where: { id },
                data: Object.assign({}, updateUser)
            });
            return res.json({ message: "User data updated successfully", updatedUserData });
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (err) {
        console.log(err);
        if (err.code === "P2002") {
            if ((_b = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("phone")) {
                next(new bad_request_1.BadRequestsException("Phone number already registered with different user", root_1.ErrorCode.USER_ALREADY_EXISTS));
            }
            else if ((_d = (_c = err.meta) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.includes("email")) {
                next(new bad_request_1.BadRequestsException("Email already registered with different user", root_1.ErrorCode.USER_ALREADY_EXISTS));
            }
        }
        else {
            next(new bad_request_1.BadRequestsException(err === null || err === void 0 ? void 0 : err.message, root_1.ErrorCode.UNPROCESSABLE_ENTITY));
        }
    }
});
exports.updateUser = updateUser;
