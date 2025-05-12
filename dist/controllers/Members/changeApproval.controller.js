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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveOrDeclineMemberChanges = void 0;
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const lodash_1 = __importDefault(require("lodash"));
const approveOrDeclineMemberChanges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pendingChangeId, action, declineReason } = req.body;
    try {
        if (req.user.role !== "ADMIN") {
            throw new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
        }
        if (!["APPROVED", "DECLINED"].includes(action)) {
            throw new bad_request_1.BadRequestsException("Invalid action", root_1.ErrorCode.INVALID_INPUT);
        }
        const pendingChange = yield __1.prismaClient.membersPendingChanges.findUnique({
            where: {
                id: pendingChangeId,
            },
        });
        if (!pendingChange || pendingChange.approvalStatus !== "PENDING") {
            throw new bad_request_1.BadRequestsException("Pending change not found or already processed", root_1.ErrorCode.NO_DATA_PROVIDED);
        }
        const { membershipId, updatedData } = pendingChange;
        if (action === "APPROVED") {
            const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                const existingMember = yield prisma.members.findUnique({
                    where: { membershipId },
                    include: {
                        machineryInformations: true,
                        branches: { include: { machineryInformations: true } },
                        complianceDetails: true,
                        similarMembershipInquiry: true,
                        attachments: true,
                        proposer: true,
                        executiveProposer: true,
                        declarations: true,
                    },
                });
                yield applyChanges(prisma, membershipId, updatedData, req.user.userId, existingMember);
                yield prisma.membersPendingChanges.update({
                    where: { id: pendingChangeId },
                    data: {
                        approvalStatus: "APPROVED",
                        approvedOrDeclinedBy: req.user.userId,
                    },
                });
                return { message: "Pending changes approved and applied successfully" };
            }));
            return res.json(result);
        }
        if (action === "DECLINED") {
            yield __1.prismaClient.membersPendingChanges.update({
                where: { id: pendingChangeId },
                data: {
                    approvalStatus: "DECLINED",
                    approvedOrDeclinedBy: req.user.userId,
                    declineReason: declineReason || null,
                },
            });
            return res.json({ message: "Pending changes declined successfully" });
        }
    }
    catch (error) {
        console.error(error);
        next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.approveOrDeclineMemberChanges = approveOrDeclineMemberChanges;
// function calculateFieldDifferences(existing: any, incoming: any): any {
//   const result: any = {};
//   for (const key in incoming) {
//     if (_.isEqual(existing[key], incoming[key])) continue;
//     result[key] = incoming[key];
//   }
//   return result;
// }
function applyChanges(prisma, membershipId, changes, adminId, existingMember) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(changes).length === 0)
            return;
        if (changes.machineryInformations) {
            yield prisma.machineryInformations.updateMany({
                where: { membershipId },
                data: changes.machineryInformations,
            });
        }
        //branches
        // Check if branches exist in the incoming data
        if (changes.branches) {
            const existingBranches = existingMember.branches || [];
            const incomingBranches = changes.branches
                .map((b) => b.id)
                .filter(Boolean);
            const toDelete = existingBranches.filter((b) => !incomingBranches.includes(b.id));
            yield Promise.all(toDelete.map((branch) => {
                return prisma.branches.delete({
                    where: { id: branch.id },
                });
            }));
            for (const branch of changes.branches) {
                if (branch.id) {
                    yield prisma.branches.update({
                        where: { id: branch.id },
                        data: {
                            electricalUscNumber: branch.electricalUscNumber,
                            scNumber: branch.scNumber,
                            proprietorType: branch.proprietorType,
                            proprietorStatus: branch.proprietorStatus,
                            sanctionedHP: branch.sanctionedHP,
                            placeOfBusiness: branch.placeOfBusiness,
                        },
                    });
                    if (branch.machineryInformation) {
                        yield prisma.machineryInformations.update({
                            where: { branchId: branch.machineryInformation.branchId },
                            data: Object.assign({}, branch.machineryInformation),
                        });
                    }
                }
                else {
                    const createdBranch = yield prisma.branches.create({
                        data: {
                            electricalUscNumber: branch.electricalUscNumber,
                            scNumber: branch.scNumber,
                            proprietorType: branch.proprietorType,
                            proprietorStatus: branch.proprietorStatus,
                            sanctionedHP: branch.sanctionedHP,
                            placeOfBusiness: branch.placeOfBusiness,
                            membershipId,
                        },
                    });
                    if (branch.machineryInformation) {
                        yield prisma.machineryInformations.create({
                            data: Object.assign(Object.assign({}, branch.machineryInformations), { branchId: createdBranch.id }),
                        });
                    }
                }
            }
            if (changes.complianceDetails) {
                yield prisma.complianceDetails.update({
                    where: { membershipId },
                    data: changes.complianceDetails,
                });
            }
            if (changes.similarMembershipInquiry) {
                yield prisma.similarMembershipInquiry.update({
                    where: { membershipId },
                    data: changes.similarMembershipInquiry,
                });
            }
            if (changes.attachments) {
                const existingAttachments = existingMember.attachments || [];
                const incomingAttachments = changes.attachments
                    .map((b) => b.id)
                    .filter(Boolean);
                const toDelete = existingAttachments.filter((a) => !incomingAttachments.includes(a.id));
                yield Promise.all(toDelete.map((attachment) => {
                    return prisma.attachments.delete({
                        where: { id: attachment.id },
                    });
                }));
                for (const attachment of changes.attachments) {
                    if (attachment.id) {
                        yield prisma.attachments.update({
                            where: { id: attachment.id },
                            data: Object.assign({}, attachment),
                        });
                    }
                    else {
                        yield prisma.attachments.create({
                            data: Object.assign(Object.assign({}, attachment), { membershipId }),
                        });
                    }
                }
            }
            if (changes.proposer) {
                yield prisma.proposer.update({
                    where: { membershipId },
                    data: changes.proposer,
                });
            }
            if (changes.executiveProposer) {
                yield prisma.executiveProposer.update({
                    where: { membershipId },
                    data: changes.executiveProposer,
                });
            }
            if (changes.declarations) {
                yield prisma.declarations.update({
                    where: { membershipId },
                    data: changes.declarations,
                });
            }
            const memberFields = lodash_1.default.omit(changes, [
                "machineryInformations",
                "branches",
                "complianceDetails",
                "similarMembershipInquiry",
                "attachments",
                "proposer",
                "executiveProposer",
                "declarations",
            ]);
            if (Object.keys(memberFields).length > 0) {
                yield prisma.members.update({
                    where: { membershipId },
                    data: Object.assign({}, memberFields),
                });
            }
        }
    });
}
