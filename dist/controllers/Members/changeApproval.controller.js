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
        if (action === "APPROVED") {
            const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                yield applyChanges(prisma, pendingChange, req.user.userId);
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
function applyChanges(prisma, changes, adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { partnerDetails, machineryInformations, branchDetails, attachments, complianceDetails, similarMembershipInquiry, proposer, executiveProposer, declarations, membershipId } = changes, memberData = __rest(changes, ["partnerDetails", "machineryInformations", "branchDetails", "attachments", "complianceDetails", "similarMembershipInquiry", "proposer", "executiveProposer", "declarations", "membershipId"]);
        if (partnerDetails) {
            yield updatePartnerDetails(prisma, membershipId, partnerDetails);
        }
        if (machineryInformations) {
            yield updateMachineryInformations(prisma, membershipId, machineryInformations);
        }
        if (branchDetails) {
            yield updateBranchDetails(prisma, membershipId, branchDetails);
        }
        if (attachments) {
            console.log("Updating attachments for membershipId:", membershipId);
            console.log("Attachments data:", attachments);
            yield updateAttachments(prisma, membershipId, attachments);
        }
        if (complianceDetails) {
            yield prisma.complianceDetails.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, complianceDetails), { membershipId }), ['id'])
            });
        }
        if (similarMembershipInquiry) {
            yield prisma.similarMembershipInquiry.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, similarMembershipInquiry), { membershipId }), ['id'])
            });
        }
        if (proposer) {
            yield prisma.proposer.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, proposer), { membershipId }), ['id'])
            });
        }
        if (executiveProposer) {
            yield prisma.executiveProposer.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, executiveProposer), { membershipId }), ['id'])
            });
        }
        if (declarations) {
            yield prisma.declarations.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, declarations), { membershipId }), ['id'])
            });
        }
        if (Object.keys(memberData).length > 0) {
            yield prisma.members.update({
                where: {
                    membershipId: membershipId,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, memberData), { membershipId }), ['id'])
            });
        }
    });
}
const updatePartnerDetails = (prisma, membershipId, PartnerDetails) => __awaiter(void 0, void 0, void 0, function* () {
    if (PartnerDetails.deletePartnerDetails && PartnerDetails.deletePartnerDetails.length > 0) {
        yield prisma.partnerDetails.deleteMany({
            where: {
                id: {
                    in: PartnerDetails.deletePartnerDetails.map((partner) => partner.id)
                },
                membershipId: membershipId
            }
        });
    }
    if (PartnerDetails.newPartnerDetails && PartnerDetails.newPartnerDetails.length > 0) {
        const partnerDetailsToAdd = PartnerDetails.newPartnerDetails.map((partner) => (Object.assign({ membershipId }, partner)));
        console.log("Adding partner details:", partnerDetailsToAdd);
        yield prisma.partnerDetails.createMany({
            data: partnerDetailsToAdd,
            skipDuplicates: true // This will skip duplicate entries based on unique constraints
        });
    }
    if (PartnerDetails.updatePartnerDetails && PartnerDetails.updatePartnerDetails.length > 0) {
        const partnerUpdates = PartnerDetails.updatePartnerDetails.map((partner) => ({
            where: {
                id: partner.id,
                membershipId: membershipId,
            },
            data: lodash_1.default.omit(Object.assign(Object.assign({}, partner), { membershipId }), ['id'])
        }));
        yield Promise.all(partnerUpdates.map((update) => prisma.partnerDetails.update(update)));
    }
});
const updateMachineryInformations = (prisma, membershipId, machineryInformations) => __awaiter(void 0, void 0, void 0, function* () {
    if (machineryInformations.deleteMachineryInformations && machineryInformations.deleteMachineryInformations.length > 0) {
        yield prisma.machineryInformations.deleteMany({
            where: {
                id: {
                    in: machineryInformations.deleteMachineryInformations.map((machinery) => machinery.id)
                },
                membershipId: membershipId
            }
        });
    }
    if (machineryInformations.newMachineryInformations && machineryInformations.newMachineryInformations.length > 0) {
        const machineryToAdd = machineryInformations.newMachineryInformations.map((machinery) => (Object.assign({ membershipId }, machinery)));
        yield prisma.machineryInformations.createMany({
            data: machineryToAdd,
            skipDuplicates: true // This will skip duplicate entries based on unique constraints
        });
    }
    if (machineryInformations.updateMachineryInformations && machineryInformations.updateMachineryInformations.length > 0) {
        const machineryUpdates = machineryInformations.updateMachineryInformations.map((machinery) => ({
            where: {
                id: machinery.id,
            },
            data: lodash_1.default.omit(Object.assign(Object.assign({}, machinery), { membershipId }), ['id'])
        }));
        yield Promise.all(machineryUpdates.map((update) => prisma.machineryInformations.update(update)));
    }
});
const updateBranchDetails = (prisma, membershipId, branchDetails) => __awaiter(void 0, void 0, void 0, function* () {
    if (branchDetails.deleteBranchDetails && branchDetails.deleteBranchDetails.length > 0) {
        yield prisma.branchDetails.deleteMany({
            where: {
                id: {
                    in: branchDetails.deleteBranchDetails.map((branch) => branch.id)
                },
                membershipId: membershipId
            }
        });
    }
    if (branchDetails.newBranchDetails && branchDetails.newBranchDetails.length > 0) {
        for (const branch of branchDetails.newBranchDetails) {
            const { machineryInformations } = branch, branchData = __rest(branch, ["machineryInformations"]);
            const newBranch = yield prisma.branchDetails.create({
                data: Object.assign({}, branchData)
            });
            if (machineryInformations && machineryInformations.length > 0) {
                const machineryToAdd = machineryInformations.map((machinery) => (Object.assign(Object.assign({}, machinery), { branchId: newBranch.id })));
                yield prisma.machineryInformations.createMany({
                    data: machineryToAdd,
                    skipDuplicates: true
                });
            }
        }
    }
    if (branchDetails.updateBranchDetails && branchDetails.updateBranchDetails.length > 0) {
        for (const branch of branchDetails.updateBranchDetails) {
            const { newMachineryInformations, updateMachineryInformations, deleteMachineryInformations } = branch, branchData = __rest(branch, ["newMachineryInformations", "updateMachineryInformations", "deleteMachineryInformations"]);
            if (deleteMachineryInformations && deleteMachineryInformations.length > 0) {
                yield prisma.machineryInformations.deleteMany({
                    where: {
                        id: {
                            in: deleteMachineryInformations || []
                        },
                        branchId: branch.id
                    }
                });
            }
            if (newMachineryInformations && newMachineryInformations.length > 0) {
                const machineryToAdd = newMachineryInformations.map((machinery) => (Object.assign(Object.assign({}, machinery), { branchId: branch.id })));
                yield prisma.machineryInformations.createMany({
                    data: machineryToAdd,
                    skipDuplicates: true
                });
            }
            if (updateMachineryInformations && updateMachineryInformations.length > 0) {
                const machineryUpdates = updateMachineryInformations.map((machinery) => ({
                    where: {
                        id: machinery.id,
                        branchId: branch.id
                    },
                    data: lodash_1.default.omit(Object.assign(Object.assign({}, machinery), { branchId: branch.id }), ['id'])
                }));
                yield Promise.all(machineryUpdates.map((update) => prisma.machineryInformations.update(update)));
            }
            yield prisma.branches.update({
                where: {
                    id: branch.id,
                },
                data: lodash_1.default.omit(Object.assign(Object.assign({}, branchData), { membershipId }), ['id'])
            });
        }
    }
});
const updateAttachments = (prisma, membershipId, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    const { deleteAttachments, newAttachments, updateAttachments } = attachments;
    console.log("Attachments to update:", attachments);
    if (deleteAttachments && deleteAttachments.length > 0) {
        const attachDelete = yield prisma.attachments.deleteMany({
            where: {
                id: {
                    in: deleteAttachments.map((attachment) => attachment.id)
                },
                membershipId: membershipId
            }
        });
    }
    console.log("Attachments to delete:", deleteAttachments);
    if (newAttachments && newAttachments.length > 0) {
        const attachmentsToAdd = newAttachments.map((attachment) => (Object.assign({ membershipId }, attachment)));
        yield prisma.attachments.createMany({
            data: attachmentsToAdd,
            skipDuplicates: true // This will skip duplicate entries based on unique constraints
        });
    }
    if (updateAttachments && updateAttachments.length > 0) {
        const attachmentUpdates = updateAttachments.map((attachment) => ({
            where: {
                id: attachment.id,
                membershipId: membershipId,
            },
            data: lodash_1.default.omit(Object.assign(Object.assign({}, attachment), { membershipId }), ['id'])
        }));
        yield Promise.all(attachmentUpdates.map((update) => prisma.attachments.update(update)));
    }
});
