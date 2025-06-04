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
exports.getTaxInvoiceByMemberID = exports.getTaxInvoiceByID = exports.getAllTaxInvoice = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getAllTaxInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taxInvoices = yield __1.prismaClient.taxInvoice.findMany();
        res.status(200).json({ taxInvoices });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllTaxInvoice = getAllTaxInvoice;
const getTaxInvoiceByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceId } = req.params;
        const taxInvoice = yield __1.prismaClient.taxInvoice.findMany({
            where: { invoiceId: invoiceId }
        });
        if (!taxInvoice || taxInvoice.length === 0) {
            return next(new bad_request_1.BadRequestsException("Tax invoice not found", root_1.ErrorCode.NOT_FOUND));
        }
        res.status(200).json({ taxInvoice });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getTaxInvoiceByID = getTaxInvoiceByID;
const getTaxInvoiceByMemberID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { membershipId } = req.params;
        const taxInvoices = yield __1.prismaClient.taxInvoice.findMany({
            where: { membershipId: membershipId }
        });
        if (!taxInvoices || taxInvoices.length === 0) {
            return next(new bad_request_1.BadRequestsException("Tax invoices not found", root_1.ErrorCode.NOT_FOUND));
        }
        res.status(200).json({ taxInvoices });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getTaxInvoiceByMemberID = getTaxInvoiceByMemberID;
