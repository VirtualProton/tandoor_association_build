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
exports.deleteMeeting = void 0;
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const __1 = require("../..");
const deleteMeeting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetId } = req.params;
        if (!["ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        yield __1.prismaClient.meetings.delete({
            where: {
                meetId
            }
        });
        res.status(200).json({ message: `Meeting ${meetId} deleted successfully` });
    }
    catch (error) {
        console.error("Error in delete meetings:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteMeeting = deleteMeeting;
