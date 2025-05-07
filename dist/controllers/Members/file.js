"use strict";
// import { Response, NextFunction } from "express";
// import { Request } from "../../types/express";
// import { MemberPartialUpdateSchema } from "../../schema/members/UpdateMember";
// import { prismaClient } from "../..";
// import { ErrorCode } from "../../exceptions/root";
// import { BadRequestsException } from "../../exceptions/bad-request";
// import _ from "lodash";
// import otpService from "../../services/otp/otp.service";
// export const updateMember = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const partialUpdateData = MemberPartialUpdateSchema.parse(req.body);
//   try {
//     if (["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
//       const existingMember = await prismaClient.members.findUnique({
//         where: { membershipId: partialUpdateData.membershipId },
//         include: {
//           machineryInformation: true,
//           branches: { include: { machineryInformation: true } },
//           complianceDetails: true,
//           similarMembershipInquiry: true,
//           attachments: true,
//           proposer: true,
//           executiveProposer: true,
//           declarations: true,
//         },
//       });
//       if (!existingMember) {
//         throw new BadRequestsException(
//           "Member not found",
//           ErrorCode.NOT_FOUND
//         );
//       }
//       const changes = calculateFieldDifferences(
//         existingMember,
//         partialUpdateData
//       );
//       // Check if there are any changes to be made
//       if (Object.keys(changes).length === 0) {
//         throw new BadRequestsException(
//           "No changes detected",
//           ErrorCode.NO_DATA_PROVIDED
//         );
//       }
//       if (req.user.role === "TSMWA_EDITOR" || req.user.role === "TQMA_EDITOR") {
//         const otp = req.headers["x-otp-code"];
//         if (!otp) {
//           return next(
//             new BadRequestsException(
//               "OTP code is required",
//               ErrorCode.INVALID_INPUT
//             )
//           );
//         }
//         const isValid = otpService.verifyOTP(req.user.phone, otp as string);
//         if (!isValid) {
//           return next(
//             new BadRequestsException(
//               "Invalid or expired OTP",
//               ErrorCode.INVALID_INPUT
//             )
//           );
//         }
//       }
//       // Save approved record in pending changes
//       const result = await prismaClient.$transaction(async (prisma) => {
//         return await applyChanges( prisma, partialUpdateData.membershipId, changes, req.user.userId);
//       });
//       return res.json(result);
//     }
//     return next(
//       new BadRequestsException("Invalid user role", ErrorCode.UNAUTHORIZED)
//     );
//   }  catch (e) {
//     console.log(e);
//     next(e);
//   }
// };
// function calculateFieldDifferences(existing: any, incoming: any): any {
//   const result: any = {};
//   for (const key in incoming) {
//     if (_.isEqual(existing[key], incoming[key])) continue;
//     result[key] = incoming[key];
//   }
//   return result;
// }
// async function applyChanges(
//   prisma: any,
//   membershipId: string,
//   changes: any,
//   userId: number
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
//         approvedOrDeclinedBy: userId,
//         approvedOrDeclinedAt: new Date(),
//         nextDueDate: new Date(
//           new Date().setFullYear(new Date().getFullYear() + 1)
//         ),
//       },
//     });
//   }
//   return {message: "Changes applied successfully"}
// }
