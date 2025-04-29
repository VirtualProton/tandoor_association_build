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
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const __1 = require("../..");
const getAllMeetings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!["ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const meetings = yield __1.prismaClient.meetings.findMany({
            orderBy: {
                startTime: 'desc', // or 'asc'
            }
        });
        res.status(200).json({ message: "Meetings retrieved successfully", data: meetings });
    }
    catch (error) {
        console.error("Error in getAllMeetings:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
