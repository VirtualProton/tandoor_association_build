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
exports.TaxInvoicePartialUpdateSchema = void 0;
const zod_1 = require("zod");
// Base fields excluding invoiceId
const TaxInvoiceFieldsOptional = zod_1.z.object({
    membershipId: zod_1.z.string().max(225).optional(),
    invoiceDate: zod_1.z.coerce.date().optional(),
    hsnCode: zod_1.z.string().max(225).optional(),
    particular: zod_1.z.string().optional(),
    stoneCount: zod_1.z.number().int().optional(),
    size: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    totalSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    ratePerSqFeet: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    amount: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    cGSTInPercent: zod_1.z.number().int().optional(),
    sGSTInPercent: zod_1.z.number().int().optional(),
    iGSTInPercent: zod_1.z.number().int().optional(),
    subTotal: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    total: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
});
// Full schema with invoiceId required
exports.TaxInvoicePartialUpdateSchema = TaxInvoiceFieldsOptional.extend({
    invoiceId: zod_1.z.string().max(225),
}).refine((data) => {
    const { invoiceId } = data, rest = __rest(data, ["invoiceId"]);
    return Object.values(rest).some((value) => value !== undefined);
}, {
    message: "At least one field other than invoiceId must be provided",
});
