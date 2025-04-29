"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = exports.Gender = exports.Status = exports.Role = void 0;
const zod_1 = require("zod");
// Enums
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["EDITOR"] = "EDITOR";
    Role["VIEWER"] = "VIEWER";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (exports.Status = Status = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
// Schema
exports.SignUpSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    gender: zod_1.z.nativeEnum(Gender),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    role: zod_1.z.nativeEnum(Role).default(Role.VIEWER),
});
