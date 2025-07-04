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
exports.addTaxInvoiceController = void 0;
const __1 = require("../..");
const addTaxInvoice_1 = require("../../schema/taxInvoice/addTaxInvoice");
const generateTaxInvoiceID_1 = require("../../utils/generateTaxInvoiceID");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const addTaxInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = addTaxInvoice_1.TaxInvoiceSchema.parse(req.body), { invoiceItem, invoiceId } = _a, taxInvoice = __rest(_a, ["invoiceItem", "invoiceId"]);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const invoice = yield __1.prismaClient.taxInvoice.create({
            data: Object.assign(Object.assign({ invoiceId: invoiceId ? invoiceId : yield (0, generateTaxInvoiceID_1.generateTaxInvoiceID)(__1.prismaClient) }, taxInvoice), { createdBy: req.user.userId, invoiceItems: {
                    create: invoiceItem.map((item) => ({
                        hsnCode: item.hsnCode,
                        particular: item.particular,
                        stoneCount: item.stoneCount,
                        size: item.size,
                        totalSqFeet: item.totalSqFeet,
                        ratePerSqFeet: item.ratePerSqFeet,
                        amount: item.amount,
                    })),
                } }),
        });
        res.status(200).json({ message: "Tax invoice created successfully", invoice });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addTaxInvoiceController = addTaxInvoiceController;
