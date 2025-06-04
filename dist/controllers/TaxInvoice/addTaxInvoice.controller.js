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
exports.addTaxInvoiceController = void 0;
const __1 = require("../..");
const addTaxInvoice_1 = require("../../schema/taxInvoice/addTaxInvoice");
const generateTaxInvoiceID_1 = require("../../utils/generateTaxInvoiceID");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const addTaxInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taxInvoiceData = addTaxInvoice_1.TaxInvoiceSchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const invoice = yield __1.prismaClient.taxInvoice.create({
            data: Object.assign(Object.assign({}, taxInvoiceData), { createdBy: req.user.userId, invoiceId: taxInvoiceData.invoiceId
                    ? taxInvoiceData.invoiceId
                    : yield (0, generateTaxInvoiceID_1.generateTaxInvoiceID)(__1.prismaClient) }),
        });
        res.status(200).json({ message: "Tax invoice created successfully", invoice });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addTaxInvoiceController = addTaxInvoiceController;
