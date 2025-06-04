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
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
const Role = zod_1.z.enum(["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"]);
const StatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
const GenderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
// Schema
exports.updateUserSchema = zod_1.z
    .object({
    id: zod_1.z.number().int(),
    fullName: zod_1.z.string().min(1, "Full name is required").optional(),
    gender: GenderEnum.optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits").optional(),
    role: Role.optional(),
    status: StatusEnum.optional()
})
    .refine((data) => {
    // Exclude `id` and check that at least one other field is present
    const { id } = data, rest = __rest(data, ["id"]);
    return Object.values(rest).some((value) => value !== undefined);
}, {
    message: "At least one field other than 'id' must be provided",
    path: [] // general error, not tied to a specific field
});
