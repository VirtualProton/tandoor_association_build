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
exports.updateLabour = void 0;
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const lodash_1 = __importDefault(require("lodash"));
const updateLabours_1 = require("../../schema/labours/updateLabours");
const updateLabour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const partialUpdateData = updateLabours_1.LabourPartialUpdateSchema.parse(req.body);
    try {
        if (["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            const existingLabour = yield __1.prismaClient.labours.findUnique({
                where: { labourId: partialUpdateData.labourId },
                include: {
                    laboursAdditionalDocs: true,
                    LabourHistory: true,
                    members: {
                        select: {
                            membershipId: true,
                            firmName: true,
                        },
                    },
                },
            });
            if (!existingLabour) {
                throw new bad_request_1.BadRequestsException("Labour not found", root_1.ErrorCode.NOT_FOUND);
            }
            const changes = calculateFieldDifferences(existingLabour, partialUpdateData);
            const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                const updateResult = yield applyLabourChanges(prisma, partialUpdateData.labourId, changes, req.user.userId);
                return updateResult;
            }));
            res.status(200).json(result);
        }
        else {
            throw new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
        }
    }
    catch (error) {
        console.error("Error in updateLabour:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateLabour = updateLabour;
function calculateFieldDifferences(existing, incoming) {
    const result = {};
    for (const key in incoming) {
        if (lodash_1.default.isEqual(existing[key], incoming[key]))
            continue;
        result[key] = incoming[key];
    }
    return result;
}
function applyLabourChanges(prisma, labourId, changes, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(changes).length === 0)
            return;
        if (changes.laboursAdditionalDocs) {
            for (const doc of changes.laboursAdditionalDocs) {
                if (doc.id) {
                    // Update existing document
                    yield prisma.laboursAdditionalDocs.update({
                        where: { id: doc.id },
                        data: Object.assign({}, lodash_1.default.omit(doc, ["id", "labourId"])),
                    });
                }
                else {
                    // Create new document
                    yield prisma.laboursAdditionalDocs.create({
                        data: Object.assign(Object.assign({}, doc), { labourId }),
                    });
                }
            }
        }
        const labourFields = lodash_1.default.omit(changes, ["laboursAdditionalDocs"]);
        let data = Object.assign(Object.assign({}, labourFields), { modifiedBy: userId, approvedOrDeclinedAt: new Date() });
        if (Object.keys(labourFields).length > 0) {
            yield prisma.labours.update({
                where: { labourId },
                data: Object.assign(Object.assign({}, labourFields), { modifiedBy: userId }),
            });
        }
        return { message: "Labour changes applied successfully" };
    });
}
