"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInvoiceSchema = void 0;
const zod_1 = require("zod");
const InvoiceItem = zod_1.z.object({
    hsnCode: zod_1.z.string().max(225),
    particular: zod_1.z.string(), // Text
    stoneCount: zod_1.z.number().int(),
    size: zod_1.z.coerce.number().nonnegative().max(99999999.99), // Decimal(10,2)
    totalSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    ratePerSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    amount: zod_1.z.coerce.number().nonnegative().max(99999999.99),
});
// Define the Zod schema for TaxInvoice
exports.TaxInvoiceSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().max(225).optional(),
    membershipId: zod_1.z.string().max(225),
    invoiceDate: zod_1.z.coerce.date(),
    cGSTInPercent: zod_1.z.number().int(),
    sGSTInPercent: zod_1.z.number().int(),
    iGSTInPercent: zod_1.z.number().int(),
    subTotal: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    total: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    invoiceItem: zod_1.z.array(InvoiceItem).default([])
});
