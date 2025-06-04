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
exports.getInactiveUser = exports.getUserById = exports.getAllUsers = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role === "ADMIN") {
            const users = yield __1.prismaClient.user.findMany();
            return res.json(users);
        }
        return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    catch (err) {
        console.log(err.message);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (req.user.role === "ADMIN") {
            const user = yield __1.prismaClient.user.findUnique({
                where: { id: Number(id) }
            });
            if (user) {
                return res.json(user);
            }
            return res.json({ message: "User not found" });
        }
        return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    catch (err) {
        console.log(err.message);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getUserById = getUserById;
const getInactiveUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role === "ADMIN") {
            const users = yield __1.prismaClient.user.findMany({
                where: {
                    status: "INACTIVE"
                }
            });
            return res.json(users);
        }
        return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    catch (err) {
        console.log(err.message);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getInactiveUser = getInactiveUser;
