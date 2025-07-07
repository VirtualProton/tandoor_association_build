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
exports.updateLeaseQueryController = void 0;
const __1 = require("../..");
const updateLeaseQuery_1 = require("../../schema/leaseQuery/updateLeaseQuery");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateLeaseQueryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = updateLeaseQuery_1.updateLeaseQuerySchema.parse(req.body), { newAttachments, updateAttachments, deleteAttachment, newLeaseQueryHistory, updateLeaseQueryHistory, deleteLeaseQueryHistory } = _a, updateLeaseQuery = __rest(_a, ["newAttachments", "updateAttachments", "deleteAttachment", "newLeaseQueryHistory", "updateLeaseQueryHistory", "deleteLeaseQueryHistory"]);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (deleteAttachment && deleteAttachment.length > 0) {
                yield tx.leaseQueryAttachments.deleteMany({
                    where: {
                        id: {
                            in: deleteAttachment.map((att) => att.id),
                        },
                    },
                });
            }
            if (updateAttachments && updateAttachments.length > 0) {
                yield Promise.all(updateAttachments.map((att) => tx.leaseQueryAttachments.update({
                    where: { id: att.id },
                    data: {
                        documentName: att.documentName,
                        documentPath: att.documentPath,
                    },
                })));
            }
        }));
        return res.status(200).json({
            message: "Lease query updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateLeaseQueryController = updateLeaseQueryController;
