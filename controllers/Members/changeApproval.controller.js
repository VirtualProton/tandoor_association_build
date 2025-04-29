"use strict";
// import { Response, NextFunction } from "express";
// import { Request } from "../../types/express";
// import { prismaClient } from "../..";
// import { ErrorCode } from "../../exceptions/root";
// import { BadRequestsException } from "../../exceptions/bad-request";
// import _ from "lodash";
// export const approveOrDeclineMemberChanges  = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     const { pendingChangeId, action } = req.body;
//   try {
//     if(req.user.role !== "ADMIN"){
//         throw(new BadRequestsException(
//             "Unauthorized",
//             ErrorCode.UNAUTHORIZED
//           ))
//     }
//     if (!["APPROVED", "DECLINED"].includes(action)) {
//         throw new BadRequestsException("Invalid action", ErrorCode.INVALID_INPUT);
//       }
//     const pendingChange = await prismaClient.membersPendingChanges.findUnique({
//         where: {
//           id: pendingChangeId,
//         },
//       });
//       if (!pendingChange || pendingChange.approvalStatus !== "PENDING") {
//         throw new BadRequestsException(
//           "Pending change not found or already processed",
//           ErrorCode.NO_DATA_PROVIDED
//         );
//       }
//       const { membershipId, updatedData } = pendingChange;
//       if (action === "APPROVED") {
//         const result = await prismaClient.$transaction(async (prisma) => {
//             await applyChanges(prisma, membershipId, updatedData, req.user.userId);
//             await prisma.membersPendingChanges.update({
//               where: { id: pendingChangeId },
//               data: {
//                 approvalStatus: "APPROVED",
//                 approvedOrDeclinedBy: req.user.userId
//               },
//             });
//             return { message: "Pending changes approved and applied successfully" };
//           });
//           return res.json(result);
//       }
//       if (action === "DECLINED") {
//         await prismaClient.membersPendingChanges.update({
//           where: { id: pendingChangeId },
//           data: {
//             approvalStatus: "DECLINED",
//             approvedOrDeclinedBy: req.user.userId,
//           },
//         });
//         return res.json({ message: "Pending changes declined successfully" });
//       }
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
// };
// // function calculateFieldDifferences(existing: any, incoming: any): any {
// //   const result: any = {};
// //   for (const key in incoming) {
// //     if (_.isEqual(existing[key], incoming[key])) continue;
// //     result[key] = incoming[key];
// //   }
// //   return result;
// // }
// async function applyChanges(
//   prisma: any,
//   membershipId: string,
//   changes: any,
//   adminId: number
// ) {
//   if (Object.keys(changes).length === 0) return;
//   if (changes.machineryInformations) {
//     await prisma.machineryInformations.updateMany({
//       where: { membershipId },
//       data: changes.machineryInformations,
//     });
//   }
//   if (changes.complianceDetails) {
//     await prisma.complianceDetails.updateMany({
//       where: { membershipId },
//       data: changes.complianceDetails,
//     });
//   }
//   if (changes.similarMembershipInquiry) {
//     await prisma.similarMembershipInquiry.updateMany({
//       where: { membershipId },
//       data: changes.similarMembershipInquiry,
//     });
//   }
//   if (changes.attachments) {
//     await prisma.attachments.updateMany({
//       where: { membershipId },
//       data: changes.attachments,
//     });
//   }
//   if (changes.proposer) {
//     await prisma.proposer.updateMany({
//       where: { membershipId },
//       data: changes.proposer,
//     });
//   }
//   if (changes.executiveProposer) {
//     await prisma.executiveProposer.updateMany({
//       where: { membershipId },
//       data: changes.executiveProposer,
//     });
//   }
//   if (changes.declarations) {
//     await prisma.declarations.updateMany({
//       where: { membershipId },
//       data: changes.declarations,
//     });
//   }
//   const memberFields = _.omit(changes, [
//     "machineryInformations",
//     "branches",
//     "complianceDetails",
//     "similarMembershipInquiry",
//     "attachments",
//     "proposer",
//     "executiveProposer",
//     "declarations",
//   ]);
//   if (Object.keys(memberFields).length > 0) {
//     await prisma.members.update({
//       where: { membershipId },
//       data: {
//         ...memberFields,
//         approvalStatus: "APPROVED",
//         membershipStatus: "ACTIVE",
//         approvedOrDeclinedBy: adminId,
//         approvedOrDeclinedAt: new Date(),
//         nextDueDate: new Date(
//           new Date().setFullYear(new Date().getFullYear() + 1)
//         ),
//       },
//     });
//   }
// }
