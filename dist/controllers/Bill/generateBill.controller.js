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
exports.generateBill = void 0;
const billing_1 = require("../../schema/members/billing");
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const generateBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billDetails = billing_1.MemberBillingHistorySchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        // Import the enum type from Prisma client
        const createBill = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.memberBillingHistory.create({
                data: Object.assign(Object.assign({}, billDetails), { createdBy: req.user.userId }),
            });
        }));
        return res.status(200).json(createBill);
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.generateBill = generateBill;
