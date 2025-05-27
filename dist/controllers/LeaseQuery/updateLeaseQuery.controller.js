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
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const updatedLeaseQuery = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            if (updateLeaseQuery.deleteAttachment &&
                updateLeaseQuery.deleteAttachment.length > 0) {
                yield prisma.leaseQueryAttachments.deleteMany({
                    where: {
                        id: {
                            in: updateLeaseQuery.deleteAttachment.map((attachment) => attachment.id),
                        },
                    },
                });
            }
            if (updateLeaseQuery.updateAttachments &&
                updateLeaseQuery.updateAttachments.length > 0) {
                yield Promise.all(updateLeaseQuery.updateAttachments.map((attachment) => __awaiter(void 0, void 0, void 0, function* () {
                    return prisma.leaseQueryAttachments.update({
                        where: { id: attachment.id },
                        data: Object.assign(Object.assign({}, (attachment.documentName != null && {
                            documentName: attachment.documentName,
                        })), (attachment.documentPath != null && {
                            documentPath: attachment.documentPath,
                        })),
                    });
                })));
            }
            if (updateLeaseQuery.newAttachments &&
                updateLeaseQuery.newAttachments.length > 0) {
                yield prisma.leaseQueryAttachments.createMany({
                    data: updateLeaseQuery.newAttachments
                        .filter((attachment) => typeof attachment.documentName === "string" &&
                        typeof attachment.documentPath === "string")
                        .map((attachment) => ({
                        documentName: attachment.documentName,
                        documentPath: attachment.documentPath,
                        leaseQueryId: updateLeaseQuery.leaseQueryId,
                    })),
                });
            }
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (typeof updateLeaseQuery.membershipId === "string" && {
                membershipId: updateLeaseQuery.membershipId,
            })), (typeof updateLeaseQuery.presentLeaseHolder === "string" && {
                presentLeaseHolder: updateLeaseQuery.presentLeaseHolder,
            })), (updateLeaseQuery.dateOfLease != null && {
                dateOfLease: updateLeaseQuery.dateOfLease,
            })), (updateLeaseQuery.expiryOfLease != null && {
                expiryOfLease: updateLeaseQuery.expiryOfLease,
            })), (updateLeaseQuery.dateOfRenewal != null && {
                dateOfRenewal: updateLeaseQuery.dateOfRenewal,
            })), (updateLeaseQuery.status != null && {
                status: updateLeaseQuery.status,
            }));
            yield prisma.leaseQuery.update({
                where: { leaseQueryId: updateLeaseQuery.leaseQueryId },
                data: updateData,
            });
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
