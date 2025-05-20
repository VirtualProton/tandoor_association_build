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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLabour = void 0;
const addLabours_1 = require("../../schema/labours/addLabours");
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const labourID_1 = require("../../utils/labourID");
const addLabour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const labourDetails = addLabours_1.LabourSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newLabour = yield addLabourHandler(prisma, labourDetails);
            const laboursAdditionalDocs = yield laboursAdditionalDocsHandler(prisma, newLabour.labourId, labourDetails.additionalDocs);
            const laboursHistory = yield createInitialLabourHistory(prisma, newLabour);
            newLabour["laboursAdditionalDocs"] = laboursAdditionalDocs;
            newLabour["laboursHistory"] = laboursHistory;
            return newLabour;
        }));
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Error in addLabour:", e);
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addLabour = addLabour;
const addLabourHandler = (prisma, labourDetails) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.labours.create({
        data: Object.assign({ labourId: yield (0, labourID_1.generateCustomLabourId)(prisma) }, labourDetails),
    });
});
const laboursAdditionalDocsHandler = (prisma, labourId, laboursAdditionalDocs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.laboursAdditionalDocs.createMany({
        data: laboursAdditionalDocs.map((laboursAdditionalDoc) => ({
            labourId: labourId,
            docName: laboursAdditionalDoc.docName,
            docPath: laboursAdditionalDoc.docPath
        })),
        skipDuplicates: true, // Optional: Prevents duplicate entry errors
    });
});
const createInitialLabourHistory = (prisma, labour) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return yield prisma.labourHistory.create({
        data: {
            labourId: labour.labourId,
            assignedTo: (_a = labour.assignedTo) !== null && _a !== void 0 ? _a : null,
            onBench: labour.assignedTo ? "FALSE" : labour.labourStatus !== "INACTIVE" ? "FALSE" : "TRUE",
            reasonForTransfer: "Initial registration",
        },
    });
});
