"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = void 0;
const zod_1 = require("zod");
const Role = zod_1.z.enum(["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"]);
const StatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
const GenderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
// Schema
exports.SignUpSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    gender: GenderEnum.default("MALE"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
    role: Role.default("ADMIN_VIEWER"),
    status: StatusEnum.default("ACTIVE")
});
