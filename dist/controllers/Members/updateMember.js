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
const EDITOR_ROLES = new Set(["TSMWA_EDITOR", "TQMA_EDITOR"]);
const updateMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const partialUpdateData = UpdateMember_1.MemberPartialUpdateSchema.parse(req.body);
    try {
        const existingMember = yield __1.prismaClient.members.findUnique({
            where: { membershipId: partialUpdateData.membershipId },
            include: {
                machineryInformations: true,
                branches: { include: { machineryInformations: true } },
                partnerDetails: true,
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
        if (EDITOR_ROLES.has(req.user.role)) {
            const pendingChange = yield __1.prismaClient.membersPendingChanges.create({
                data: {
                    membershipId: partialUpdateData.membershipId,
                    updatedData: changes,
                    modifiedBy: req.user.userId,
                },
            });
            return res.json({ message: "Changes submitted for approval", pendingChange });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "ADMIN") {
            const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.membersPendingChanges.create({
                    data: {
                        membershipId: partialUpdateData.membershipId,
                        updatedData: changes,
                        modifiedBy: req.user.userId,
                        approvalStatus: "APPROVED",
                        approvedOrDeclinedBy: req.user.userId,
                    },
                });
                yield applyChanges(prisma, partialUpdateData.membershipId, changes, existingMember, req.user.userId);
                return { message: "Changes approved and applied" };
            }), { timeout: 30000 });
            return res.json(result);
        }
        throw new bad_request_1.BadRequestsException("Invalid user role", root_1.ErrorCode.UNAUTHORIZED);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
exports.updateMember = updateMember;
function cleanObject(obj) {
    if (lodash_1.default.isArray(obj))
        return obj.map(cleanObject);
    if (lodash_1.default.isPlainObject(obj)) {
        const cleaned = lodash_1.default.omit(obj, ["id", "createdAt", "modifiedAt", "membershipId", "branchId"]);
        return lodash_1.default.mapValues(cleaned, cleanObject);
    }
    return obj;
}
function calculateFieldDifferences(existing, incoming) {
    const result = {};
    for (const key in incoming) {
        const cleanedExisting = cleanObject(existing[key]);
        const cleanedIncoming = cleanObject(incoming[key]);
        if (!lodash_1.default.isEqual(cleanedExisting, cleanedIncoming)) {
            result[key] = incoming[key];
        }
    }
    return result;
}
function upsertCollection(prisma, model, existingItems, incomingItems, connectData) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingIds = incomingItems.map((i) => i.id).filter(Boolean);
        const toDelete = existingItems.filter((e) => !incomingIds.includes(e.id));
        yield Promise.all(toDelete.map((item) => prisma[model].delete({ where: { id: item.id } })));
        for (const item of incomingItems) {
            if (item.id) {
                yield prisma[model].update({ where: { id: item.id }, data: item });
            }
            else {
                yield prisma[model].create({ data: Object.assign(Object.assign({}, item), connectData) });
            }
        }
    });
}
function applyChanges(prisma, membershipId, changes, existingMember, adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (changes.machineryInformations) {
            yield upsertCollection(prisma, "machineryInformations", existingMember.machineryInformations, changes.machineryInformations, { membershipId });
        }
        if (changes.branches) {
            const existingBranches = lodash_1.default.keyBy(existingMember.branches, "id");
            const incomingBranches = changes.branches;
            const incomingIds = incomingBranches.map((b) => b.id).filter(Boolean);
            const toDelete = Object.keys(existingBranches).filter(id => !incomingIds.includes(Number(id)));
            yield Promise.all(toDelete.map(id => prisma.branches.delete({ where: { id: Number(id) } })));
            for (const branch of incomingBranches) {
                if (branch.id) {
                    yield prisma.branches.update({
                        where: { id: branch.id },
                        data: lodash_1.default.omit(branch, ["machineryInformations"]),
                    });
                    if (branch.machineryInformations) {
                        yield upsertCollection(prisma, "machineryInformations", ((_a = existingBranches[branch.id]) === null || _a === void 0 ? void 0 : _a.machineryInformations) || [], branch.machineryInformations, { branchId: branch.id });
                    }
                }
                else {
                    const created = yield prisma.branches.create({
                        data: Object.assign(Object.assign({}, lodash_1.default.omit(branch, ["machineryInformations"])), { membershipId }),
                    });
                    if (branch.machineryInformations) {
                        yield upsertCollection(prisma, "machineryInformations", [], branch.machineryInformations, { branchId: created.id });
                    }
                }
            }
        }
        if (changes.partnerDetails) {
            yield upsertCollection(prisma, "partnerDetails", existingMember.partnerDetails, changes.partnerDetails, { membershipId });
        }
        if (changes.complianceDetails) {
            yield prisma.complianceDetails.update({ where: { membershipId }, data: changes.complianceDetails });
        }
        if (changes.similarMembershipInquiry) {
            yield prisma.similarMembershipInquiry.update({ where: { membershipId }, data: changes.similarMembershipInquiry });
        }
        if (changes.attachments) {
            yield upsertCollection(prisma, "attachments", existingMember.attachments, changes.attachments, { membershipId });
        }
        if (changes.proposer) {
            yield prisma.proposer.update({ where: { membershipId }, data: changes.proposer });
        }
        if (changes.executiveProposer) {
            yield prisma.executiveProposer.update({ where: { membershipId }, data: changes.executiveProposer });
        }
        if (changes.declarations) {
            yield prisma.declarations.update({ where: { membershipId }, data: changes.declarations });
        }
        const memberFields = lodash_1.default.omit(changes, [
            "machineryInformations",
            "branches",
            "complianceDetails",
            "similarMembershipInquiry",
            "attachments",
            "proposer",
            "partnerDetails",
            "executiveProposer",
            "declarations",
        ]);
        if (Object.keys(memberFields).length > 0) {
            yield prisma.members.update({
                where: { membershipId },
                data: Object.assign(Object.assign({}, memberFields), { approvalStatus: "APPROVED", membershipStatus: "ACTIVE", approvedOrDeclinedBy: adminId, approvedOrDeclinedAt: new Date(), nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) }),
            });
        }
    });
}
