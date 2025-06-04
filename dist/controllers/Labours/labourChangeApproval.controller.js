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
exports.approveOrDeclineLabourChanges = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const approveOrDeclineLabourChanges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, action, note } = req.body;
        if (req.user.role !== "ADMIN") {
            throw new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
        }
        if (!["APPROVED", "DECLINED"].includes(action.toUpperCase())) {
            throw new bad_request_1.BadRequestsException("Invalid action", root_1.ErrorCode.INVALID_INPUT);
        }
        if (["DECLINED"].includes(action.toUpperCase())) {
            yield __1.prismaClient.laboursPendingChanges.update({
                where: { id },
                data: {
                    approvalStatus: action.toUpperCase(),
                    approvedOrDeclinedBy: req.user.userId,
                    note: note,
                },
            });
            return res.status(200).json({ message: `Labour update data declined` });
        }
        const pendingChange = yield __1.prismaClient.laboursPendingChanges.findUnique({
            where: {
                id,
            },
        });
        if (!pendingChange || pendingChange.approvalStatus !== "PENDING") {
            throw new bad_request_1.BadRequestsException("Pending change not found or already processed", root_1.ErrorCode.NO_DATA_PROVIDED);
        }
        yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const { updatedData } = pendingChange;
            // Cast updatedData to the expected shape
            const partialUpdateData = updatedData;
            const { labourId, deleteAdditionalDocs, newAdditionalDocs, updateAdditionalDocs, reasonForTransfer, labourStatus, assignedTo } = partialUpdateData, remainingData = __rest(partialUpdateData, ["labourId", "deleteAdditionalDocs", "newAdditionalDocs", "updateAdditionalDocs", "reasonForTransfer", "labourStatus", "assignedTo"]);
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
                    assignedTo: true
                }
            });
            console.log(remainingData);
            yield prisma.labours.update({
                where: { labourId },
                data: Object.assign(Object.assign({}, remainingData), { labourStatus: labourStatus, assignedTo: labourStatus === "ACTIVE" ? assignedTo : null, modifiedBy: req.user.userId })
            });
            if (labour && (assignedTo || assignedTo == null) && partialUpdateData.assignedTo !== labour.assignedTo && labourStatus !== "INACTIVE") {
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
                        assignedTo: assignedTo !== null && assignedTo !== void 0 ? assignedTo : null,
                        onBench: assignedTo ? "FALSE" : "TRUE",
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
        }));
        return res
            .status(200)
            .json({ message: `Labour ${pendingChange.labourId} update approved` });
    }
    catch (err) {
        console.log(err);
        next(new bad_request_1.BadRequestsException("Failed to fetch labours", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.approveOrDeclineLabourChanges = approveOrDeclineLabourChanges;
