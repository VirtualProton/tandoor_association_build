"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInvoicePartialUpdateSchema = void 0;
const zod_1 = require("zod");
// Schema for each invoice item
const newInvoiceItemSchema = zod_1.z.object({
    hsnCode: zod_1.z.string().max(225),
    particular: zod_1.z.string(),
    stoneCount: zod_1.z.number().int(),
    size: zod_1.z.coerce.number().nonnegative().max(99999999.99), // Decimal(10,2)
    totalSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    ratePerSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    amount: zod_1.z.coerce.number().nonnegative().max(99999999.99),
});
const updateInvoiceItemSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    hsnCode: zod_1.z.string().max(225).optional(),
    particular: zod_1.z.string().optional(),
    stoneCount: zod_1.z.number().int().optional(),
    size: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    totalSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    ratePerSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    amount: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
}).refine((data) => Object.keys(Object.assign(Object.assign({}, data), { id: undefined })).some((key) => key !== "id" && data[key] !== undefined), {
    message: "At least one field other than id must be provided",
    path: [],
});
const deleteInvoiceItemSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
});
// Full schema for TaxInvoice with nested invoice items
exports.TaxInvoicePartialUpdateSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().max(225),
    membershipId: zod_1.z.string().max(225).optional(),
    invoiceDate: zod_1.z.coerce.date().optional(),
    cGSTInPercent: zod_1.z.number().int().optional(),
    sGSTInPercent: zod_1.z.number().int().optional(),
    iGSTInPercent: zod_1.z.number().int().optional(),
    subTotal: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    total: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    newInvoiceItems: zod_1.z.array(newInvoiceItemSchema).optional(),
    updateInvoiceItems: zod_1.z.array(updateInvoiceItemSchema).optional(),
    deleteInvoiceItems: zod_1.z.array(deleteInvoiceItemSchema).optional(),
}).refine((data) => Object.keys(Object.assign(Object.assign({}, data), { invoiceId: undefined })).some((key) => key !== "invoiceId" && data[key] !== undefined), {
    message: "At least one field other than invoiceId must be provided",
    path: [],
});
