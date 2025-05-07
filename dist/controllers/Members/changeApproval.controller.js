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
    const { pendingChangeId, action } = req.body;
    try {
        if (req.user.role !== "ADMIN") {
            throw (new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
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
                yield applyChanges(prisma, membershipId, updatedData, req.user.userId);
                yield prisma.membersPendingChanges.update({
                    where: { id: pendingChangeId },
                    data: {
                        approvalStatus: "APPROVED",
                        approvedOrDeclinedBy: req.user.userId
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
                },
            });
            return res.json({ message: "Pending changes declined successfully" });
        }
    }
    catch (error) {
        console.error(error);
        next(error);
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
