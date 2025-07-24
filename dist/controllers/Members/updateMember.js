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
exports.updateMember = void 0;
const UpdateMember_1 = require("../../schema/members/UpdateMember");
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const lodash_1 = __importDefault(require("lodash"));
const EDITOR_ROLES = new Set(["TSMWA_EDITOR", "TQMA_EDITOR"]);
const updateMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const memberUpdatedData = UpdateMember_1.MemberUpdateSchema.parse(req.body);
        const { partnerDetails, machineryInformations, branchDetails, attachments, complianceDetails, similarMembershipInquiry, proposer, executiveProposer, declarations, membershipId } = memberUpdatedData, memberData = __rest(memberUpdatedData, ["partnerDetails", "machineryInformations", "branchDetails", "attachments", "complianceDetails", "similarMembershipInquiry", "proposer", "executiveProposer", "declarations", "membershipId"]);
        if (EDITOR_ROLES.has(req.user.role)) {
            yield __1.prismaClient.membersPendingChanges.create({
                data: {
                    membershipId: memberUpdatedData.membershipId,
                    updatedData: memberUpdatedData,
                    modifiedBy: req.user.userId,
                }
            });
            res.status(200).json({ data: memberUpdatedData, message: "Member data update request has been submitted for approval." });
        }
        else if (req.user.role === "ADMIN") {
            yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
                if (memberData.electricalUscNumber) {
                    yield prisma.uscAssignmentHistory.updateMany({
                        where: {
                            membershipId: membershipId,
                            branchId: null,
                            unassignedAt: null
                        },
                        data: {
                            unassignedAt: new Date()
                        }
                    });
                    yield prisma.uscAssignmentHistory.create({
                        data: {
                            membershipId: membershipId,
                            electricalUscNumber: memberData.electricalUscNumber
                        }
                    });
                }
            }), { timeout: 60000 } // timeout in milliseconds (e.g., 60 seconds)
            );
            res.status(200).json({ data: memberUpdatedData, message: `Member ${membershipId} data updated successfully.` });
        }
        else {
            return next(new bad_request_1.BadRequestsException("Unauthorized to update member data.", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (error) {
        console.error("Error in updateMember:", error.code, error.message);
        if (error.code === 'P2002') {
            const conflictingFields = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target;
            console.error(`Duplicate entry for fields: ${conflictingFields}`);
            return next(new bad_request_1.BadRequestsException(`Duplicate entry: a record with the same ${conflictingFields} already exists.`, root_1.ErrorCode.DUPLICATE_ENTRY));
        }
        return next(new bad_request_1.BadRequestsException("An error occurred while updating the member.", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.updateMember = updateMember;
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
            if (branchData.electricalUscNumber) {
                yield prisma.uscAssignmentHistory.create({
                    data: {
                        membershipId,
                        branchId: newBranch.id,
                        electricalUscNumber: branchData.electricalUscNumber
                    }
                });
            }
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
            if (branchData.electricalUscNumber) {
                yield prisma.uscAssignmentHistory.updateMany({
                    where: {
                        branchId: branch.id,
                        unassignedAt: null
                    },
                    data: {
                        unassignedAt: new Date()
                    }
                });
                yield prisma.uscAssignmentHistory.create({
                    data: {
                        membershipId,
                        branchId: branch.id,
                        electricalUscNumber: branchData.electricalUscNumber
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
