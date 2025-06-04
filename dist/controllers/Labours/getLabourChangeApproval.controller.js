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
exports.getApproveOrDeclineLabourChanges = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getApproveOrDeclineLabourChanges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const LabourChanges = yield __1.prismaClient.laboursPendingChanges.findMany();
        return res.status(200).json({ message: "Labour changes retrieve successfully", LabourChanges });
    }
    catch (err) {
        console.log(err);
        next(new bad_request_1.BadRequestsException("Failed to fetch labours", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.getApproveOrDeclineLabourChanges = getApproveOrDeclineLabourChanges;
