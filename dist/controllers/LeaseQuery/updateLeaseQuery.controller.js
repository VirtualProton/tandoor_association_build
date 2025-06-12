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
const updateLeaseQueryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     const {newAttachments,updateAttachments,deleteAttachment,newLeaseQueryHistory,updateLeaseQueryHistory,deleteLeaseQueryHistory,...updateLeaseQuery} = updateLeaseQuerySchema.parse(req.body);
    //     if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
    //         return next(
    //             new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED)
    //         );
    //     }
    //     const updatedLeaseQuery = await prismaClient.$transaction(async (prisma) => {
    //             if (
    //                 deleteAttachment &&
    //                 deleteAttachment.length > 0
    //             ) {
    //                 await prisma.leaseQueryAttachments.deleteMany({
    //                     where: {
    //                         id: {
    //                             in: deleteAttachment.map(
    //                                 (attachment) => attachment.id
    //                             ),
    //                         },
    //                     },
    //                 });
    //             }
    //             if (
    //                 deleteLeaseQueryHistory &&
    //                 deleteLeaseQueryHistory.length > 0
    //             ) {
    //                 await prisma.leaseQueryHistory.deleteMany({
    //                     where: {
    //                         id: {
    //                             in: deleteLeaseQueryHistory.map(
    //                                 (history) => history.id
    //                             ),
    //                         },
    //                     },
    //                 });
    //             }
    //             if (
    //                 updateAttachments &&
    //                 updateAttachments.length > 0
    //             ) {
    //                 await Promise.all(
    //                     updateAttachments.map(async (attachment) => {
    //                         return prisma.leaseQueryAttachments.update({
    //                             where: { id: attachment.id },
    //                             data: {
    //                                 ...(attachment.documentName != null && {
    //                                     documentName: attachment.documentName,
    //                                 }), // filters null and undefined
    //                                 ...(attachment.documentPath != null && {
    //                                     documentPath: attachment.documentPath,
    //                                 }),
    //                             },
    //                         });
    //                     })
    //                 );
    //             }
    //             if (
    //                 updateLeaseQueryHistory &&
    //                 updateLeaseQueryHistory.length > 0
    //             ) {
    //                 await Promise.all(
    //                     updateLeaseQueryHistory.map(async (attachment) => {
    //                         return prisma.leaseQueryHistory.update({
    //                             where: { id: attachment.id },
    //                             data: {
    //                                 ...(attachment.presentLeaseHolder != null && {
    //                                     presentLeaseHolder: attachment.presentLeaseHolder,
    //                                 }), // filters null and undefined
    //                                 ...(attachment.fromDate != null && {
    //                                     fromDate: attachment.fromDate,
    //                                 }),
    //                                 ...(attachment.toDate != null && {
    //                                     toDate: attachment.toDate,
    //                                 }),
    //                             },
    //                         });
    //                     })
    //                 );
    //             }
    //             if (
    //                 newLeaseQueryHistory &&
    //                 newLeaseQueryHistory.length > 0
    //             ) {
    //                 await prisma.leaseQueryHistory.createMany({
    //                     data: newLeaseQueryHistory
    //                         .filter(
    //                             (history) =>
    //                                 typeof history.presentLeaseHolder === "string" &&
    //                                 history.fromDate instanceof Date &&
    //                                 history.toDate instanceof Date
    //                         )
    //                         .map((history) => ({
    //                             presentLeaseHolder: history.presentLeaseHolder as string,
    //                             fromDate: history.fromDate,
    //                             toDate: history.toDate,
    //                             leaseQueryId: updateLeaseQuery.leaseQueryId,
    //                         })),
    //                 });
    //             }
    //             if (
    //                 newAttachments &&
    //                 newAttachments.length > 0
    //             ) {
    //                 await prisma.leaseQueryAttachments.createMany({
    //                     data: newAttachments
    //                         .filter(
    //                             (attachment) =>
    //                                 typeof attachment.documentName === "string" &&
    //                                 typeof attachment.documentPath === "string"
    //                         )
    //                         .map((attachment) => ({
    //                             membershipId: updateLeaseQuery.membershipId,
    //                             documentName: attachment.documentName as string,
    //                             documentPath: attachment.documentPath as string,
    //                             leaseQueryId: updateLeaseQuery.leaseQueryId,
    //                         })),
    //                 });
    //             }
    //             await prisma.leaseQuery.update({
    //                 where: { leaseQueryId: updateLeaseQuery.leaseQueryId },
    //                 data: updateLeaseQuery
    //             });
    //         }
    //     );
    //     return res.status(200).json({
    //         message: "Lease query updated successfully",
    //     });
    // } catch (error) {
    //     next(error);
    // }
});
exports.updateLeaseQueryController = updateLeaseQueryController;
