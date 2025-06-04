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
exports.updateBill = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateBilling_1 = require("../../schema/members/updateBilling");
const updateBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateBillDetails = updateBilling_1.billingPartialUpdateSchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        // Import the enum type from Prisma client
        const { billingId } = updateBillDetails, updatedBill = __rest(updateBillDetails, ["billingId"]);
        const createBill = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.memberBillingHistory.update({
                where: {
                    billingId
                },
                data: Object.assign({}, updatedBill)
            });
            const updateBill = yield prisma.memberBillingHistory.findUniqueOrThrow({
                where: {
                    billingId
                }
            });
            const dueAmount = updateBill.totalAmount - updateBill.paidAmount;
            const paymentStatus = updateBill.paidAmount === 0 ? "DUE" : updateBill.paidAmount < updateBill.totalAmount ? "PARTIAL" : "PAID";
            yield prisma.memberBillingHistory.update({
                where: {
                    billingId
                },
                data: {
                    dueAmount,
                    paymentStatus
                }
            });
        }));
        return res.json({ message: `Bill ${billingId} updated successfully` });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateBill = updateBill;
