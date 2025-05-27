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
exports.updateLeaseQueryController = void 0;
const __1 = require("../..");
const updateLeaseQuery_1 = require("../../schema/leaseQuery/updateLeaseQuery");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateLeaseQueryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateLeaseQuery = updateLeaseQuery_1.updateLeaseQuerySchema.parse(req.body);
        const allowedRoles = ["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"];
        if (!allowedRoles.includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const { leaseQueryId, deleteAttachment = [], updateAttachments = [], newAttachments = [], membershipId, presentLeaseHolder, dateOfLease, expiryOfLease, dateOfRenewal, status, } = updateLeaseQuery;
            // Delete attachments
            if (deleteAttachment.length > 0) {
                const ids = deleteAttachment.map((a) => a.id);
                yield prisma.leaseQueryAttachments.deleteMany({
                    where: { id: { in: ids } },
                });
            }
            // Update attachments
            if (updateAttachments.length > 0) {
                yield Promise.all(updateAttachments.map(({ id, documentName, documentPath }) => prisma.leaseQueryAttachments.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, (documentName != null && { documentName })), (documentPath != null && { documentPath })),
                })));
            }
            // Create new attachments
            const validNewAttachments = newAttachments.filter((a) => typeof a.documentName === "string" && typeof a.documentPath === "string");
            if (validNewAttachments.length > 0) {
                yield prisma.leaseQueryAttachments.createMany({
                    data: validNewAttachments.map(({ documentName, documentPath }) => ({
                        leaseQueryId,
                        documentName: documentName,
                        documentPath: documentPath,
                    })),
                });
            }
            // Update lease query details
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (typeof presentLeaseHolder === "string" && { presentLeaseHolder })), (dateOfLease != null && { dateOfLease })), (expiryOfLease != null && { expiryOfLease })), (dateOfRenewal != null && { dateOfRenewal })), (status != null && { status }));
            if (typeof membershipId === "string") {
                updateData.membership = { connect: { id: membershipId } };
            }
            yield prisma.leaseQuery.update({
                where: { leaseQueryId },
                data: updateData,
            });
        }));
        return res.status(200).json({
            message: "Lease query updated successfully",
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to update lease query ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateLeaseQueryController = updateLeaseQueryController;
