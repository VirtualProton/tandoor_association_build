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
exports.updateMember = void 0;
const UpdateMember_1 = require("../../schema/members/UpdateMember");
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const lodash_1 = __importDefault(require("lodash"));
const updateMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const partialUpdateData = UpdateMember_1.MemberPartialUpdateSchema.parse(req.body);
    try {
        const existingMember = yield __1.prismaClient.members.findUnique({
            where: { membershipId: partialUpdateData.membershipId },
            include: {
                machineryInformation: true,
                branches: { include: { machineryInformation: true } },
                complianceDetails: true,
                similarMembershipInquiry: true,
                attachments: true,
                proposer: true,
                executiveProposer: true,
                declarations: true,
            },
        });
        if (!existingMember) {
            throw new bad_request_1.BadRequestsException("Member not found", root_1.ErrorCode.NOT_FOUND);
        }
        const changes = calculateFieldDifferences(existingMember, partialUpdateData);
        if (Object.keys(changes).length === 0) {
            throw new bad_request_1.BadRequestsException("No changes detected", root_1.ErrorCode.NO_DATA_PROVIDED);
        }
        if (["TSMWA_EDITOR", "TQMA_EDITOR"].includes(req.user.role)) {
            // Save pending changes only
            console.log("userID", req.user.userId);
            const pendingChange = yield __1.prismaClient.membersPendingChanges.create({
                data: {
                    membershipId: partialUpdateData.membershipId,
                    updatedData: changes,
                    modifiedBy: req.user.userId,
                },
            });
            return res.json({
                message: "Changes submitted for approval",
                pendingChange,
            });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "ADMIN") {
            const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                // Save approved record in pending changes
                yield prisma.membersPendingChanges.create({
                    data: {
                        membershipId: partialUpdateData.membershipId,
                        updatedData: changes,
                        modifiedBy: req.user.userId,
                        approvalStatus: "APPROVED",
                        approvedOrDeclinedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
                    },
                });
                // Apply update to Member schema
                yield applyChanges(prisma, partialUpdateData.membershipId, changes, req.user.userId);
                return { message: "Changes approved and applied" };
            }));
            return res.json(result);
        }
        throw new bad_request_1.BadRequestsException("Invalid user role", root_1.ErrorCode.UNAUTHORIZED);
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.updateMember = updateMember;
function calculateFieldDifferences(existing, incoming) {
    const result = {};
    for (const key in incoming) {
        if (lodash_1.default.isEqual(existing[key], incoming[key]))
            continue;
        result[key] = incoming[key];
    }
    return result;
}
function applyChanges(prisma, membershipId, changes, adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(changes).length === 0)
            return;
        if (changes.machineryInformations) {
            yield prisma.machineryInformations.updateMany({
                where: { membershipId },
                data: changes.machineryInformations,
            });
        }
        if (changes.complianceDetails) {
            yield prisma.complianceDetails.updateMany({
                where: { membershipId },
                data: changes.complianceDetails,
            });
        }
        if (changes.similarMembershipInquiry) {
            yield prisma.similarMembershipInquiry.updateMany({
                where: { membershipId },
                data: changes.similarMembershipInquiry,
            });
        }
        if (changes.attachments) {
            yield prisma.attachments.updateMany({
                where: { membershipId },
                data: changes.attachments,
            });
        }
        if (changes.proposer) {
            yield prisma.proposer.updateMany({
                where: { membershipId },
                data: changes.proposer,
            });
        }
        if (changes.executiveProposer) {
            yield prisma.executiveProposer.updateMany({
                where: { membershipId },
                data: changes.executiveProposer,
            });
        }
        if (changes.declarations) {
            yield prisma.declarations.updateMany({
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
                data: Object.assign(Object.assign({}, memberFields), { approvalStatus: "APPROVED", membershipStatus: "ACTIVE", approvedOrDeclinedBy: adminId, approvedOrDeclinedAt: new Date(), nextDueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }),
            });
        }
    });
}
