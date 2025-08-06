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
exports.getInvoiceChangeRequests = exports.getPendingInvoice = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getPendingInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield __1.prismaClient.taxInvoice.findMany({
            where: {
                status: "PENDING"
            }
        });
        res.status(200).json({ message: "Pending invoices retrieved successfully", invoices });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getPendingInvoice = getPendingInvoice;
const getInvoiceChangeRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const approvalStatus = status.toUpperCase();
        if (["ALL", "PENDING", "APPROVED", "DECLINED"].includes(approvalStatus)) {
            let invoiceChangeRequests;
            if (approvalStatus === "ALL") {
                invoiceChangeRequests = yield __1.prismaClient.invoicePendingChanges.findMany();
            }
            else {
                invoiceChangeRequests = yield __1.prismaClient.invoicePendingChanges.findMany({
                    where: {
                        approvalStatus: approvalStatus // Cast to any to bypass type error, or use the correct enum type if available
                    }
                });
            }
            res.status(200).json({ message: "Pending invoices retrieved successfully", invoiceChangeRequests });
        }
        return next(new bad_request_1.BadRequestsException("Invalid Inputs", root_1.ErrorCode.INVALID_INPUT));
    }
    catch (error) {
        console.log(error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getInvoiceChangeRequests = getInvoiceChangeRequests;
