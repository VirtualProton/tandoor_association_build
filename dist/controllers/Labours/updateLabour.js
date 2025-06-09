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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLabour = void 0;
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const updateLabours_1 = require("../../schema/labours/updateLabours");
const updateLabour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const partialUpdateData = updateLabours_1.LabourPartialUpdateSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            throw new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
        }
        console.log(req.user.role);
        if (["TSMWA_EDITOR", "TQMA_EDITOR"].includes(req.user.role)) {
            const { labourId } = partialUpdateData;
            yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.laboursPendingChanges.create({
                    data: {
                        labourId,
                        updatedData: partialUpdateData, // If updatedData is not already JSON, use JSON.stringify(updatedData)
                        modifiedBy: req.user.userId,
                        // note: "" // Provide an appropriate note or leave as empty string if not applicable
                    }
                });
            }));
            return res.status(200).json({ message: `Labour ${partialUpdateData.labourId} updated data submitted for approval` });
        }
        yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const { labourId, deleteAdditionalDocs, newAdditionalDocs, updateAdditionalDocs, reasonForTransfer } = partialUpdateData, remainingData = __rest(partialUpdateData, ["labourId", "deleteAdditionalDocs", "newAdditionalDocs", "updateAdditionalDocs", "reasonForTransfer"]);
            if (deleteAdditionalDocs && deleteAdditionalDocs.length > 0) {
                yield prisma.laboursAdditionalDocs.deleteMany({
                    where: {
                        id: {
                            in: deleteAdditionalDocs.map((doc) => doc.id)
                        }
                    }
                });
            }
            if (newAdditionalDocs && newAdditionalDocs.length > 0) {
                const docsToInsert = newAdditionalDocs.map((doc) => (Object.assign(Object.assign({}, doc), { labourId: partialUpdateData.labourId })));
                yield prisma.laboursAdditionalDocs.createMany({
                    data: docsToInsert,
                    skipDuplicates: true, // this will ignore existing (labourId, docName) pairs
                });
            }
            if (updateAdditionalDocs && updateAdditionalDocs.length > 0) {
                for (const doc of updateAdditionalDocs) {
                    const { id } = doc, updateData = __rest(doc, ["id"]);
                    yield prisma.laboursAdditionalDocs.update({
                        where: { id },
                        data: Object.assign({}, updateData),
                    });
                }
            }
            const labour = yield prisma.labours.findUnique({
                where: { labourId: partialUpdateData.labourId },
                select: {
                    assignedTo: true,
                    labourStatus: true
                }
            });
            console.log(remainingData);
            yield prisma.labours.update({
                where: { labourId },
                data: Object.assign(Object.assign({}, remainingData), { modifiedBy: req.user.userId })
            });
            if (partialUpdateData.labourStatus) {
                if (labour && (labour.assignedTo !== partialUpdateData.assignedTo || labour && labour.labourStatus !== partialUpdateData.labourStatus)) {
                    yield prisma.labourHistory.updateMany({
                        where: {
                            labourId: partialUpdateData.labourId,
                            toDate: null
                        },
                        data: {
                            toDate: new Date()
                        }
                    });
                    yield prisma.labourHistory.create({
                        data: {
                            labourId: partialUpdateData.labourId,
                            assignedTo: partialUpdateData.assignedTo || null,
                            labourStatus: partialUpdateData.labourStatus,
                            reasonForTransfer: reasonForTransfer
                        }
                    });
                }
                else {
                    yield prisma.labourHistory.updateMany({
                        where: {
                            labourId: partialUpdateData.labourId,
                            toDate: null
                        },
                        data: {
                            toDate: new Date()
                        }
                    });
                }
            }
            return res.status(200).json({ message: `Labour ${partialUpdateData.labourId} updated successfully` });
        }));
    }
    catch (error) {
        console.error("Error in updateLabour:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateLabour = updateLabour;
