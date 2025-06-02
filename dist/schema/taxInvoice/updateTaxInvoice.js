"use strict";
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
exports.updateTaxInvoiceSchema = void 0;
const zod_1 = require("zod");
const InvoiceItem = zod_1.z.object({
    id: zod_1.z.number().int().optional(),
    invoiceId: zod_1.z.string().max(225).optional(),
    hsnCode: zod_1.z.string().max(225),
    particular: zod_1.z.string(), // Text
    stoneCount: zod_1.z.number().int(),
    size: zod_1.z.coerce.number().nonnegative().max(99999999.99), // Decimal(10,2)
    totalSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    ratePerSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99),
    amount: zod_1.z.coerce.number().nonnegative().max(99999999.99),
});
const DeleteItem = zod_1.z.object({
    id: zod_1.z.number().int()
});
// Define the Zod schema for TaxInvoice
exports.updateTaxInvoiceSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().max(225), // Now required
    membershipId: zod_1.z.string().max(225).optional(),
    invoiceDate: zod_1.z.coerce.date().optional(),
    cGSTInPercent: zod_1.z.number().int().optional(),
    sGSTInPercent: zod_1.z.number().int().optional(),
    iGSTInPercent: zod_1.z.number().int().optional(),
    subTotal: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    total: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    newInvoiceItem: zod_1.z.array(InvoiceItem).optional(),
    updateInvoiceItem: zod_1.z.array(InvoiceItem).optional(),
    deleteInvoiceItem: zod_1.z.array(DeleteItem).optional(),
}).refine((data) => {
    const { invoiceId } = data, rest = __rest(data, ["invoiceId"]);
    // Check if at least one other field (besides invoiceId) is defined
    return Object.values(rest).some((value) => value !== undefined && value !== null);
}, {
    message: "At least one field other than invoiceId must be provided",
    path: [], // Applies to the whole object
});
