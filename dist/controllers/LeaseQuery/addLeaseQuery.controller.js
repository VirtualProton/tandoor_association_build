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
exports.addLeaseQueryController = void 0;
const __1 = require("../..");
const addLeaseQuery_1 = require("../../schema/leaseQuery/addLeaseQuery");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const generateLeaseQueryID_1 = require("../../utils/generateLeaseQueryID");
const addLeaseQueryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaseQuery = addLeaseQuery_1.addLeaseQuerySchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const id = leaseQuery.leaseQueryId || (yield (0, generateLeaseQueryID_1.generateLeaseQueryID)(prisma));
            const addedLeaseQuery = yield prisma.leaseQuery.create({
                data: {
                    leaseQueryId: id,
                    membershipId: leaseQuery.membershipId,
                    presentLeaseHolder: leaseQuery.presentLeaseHolder,
                    dateOfLease: leaseQuery.dateOfLease,
                    expiryOfLease: leaseQuery.expiryOfLease,
                    dateOfRenewal: leaseQuery.dateOfRenewal,
                    status: leaseQuery.status,
                    createdBy: req.user.userId,
                    leaseQueryAttachments: {
                        create: ((_a = leaseQuery.leaseQueryAttachments) === null || _a === void 0 ? void 0 : _a.map((attachment) => ({
                            documentName: attachment.documentName,
                            documentPath: attachment.documentPath
                        }))) || []
                    }
                }
            });
            if (!addedLeaseQuery) {
                throw new bad_request_1.BadRequestsException("Failed to create lease query", root_1.ErrorCode.BAD_REQUEST);
            }
            return addedLeaseQuery;
        }));
        res.status(201).json({
            message: "Lease query added successfully",
            data: result
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to create lease query ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addLeaseQueryController = addLeaseQueryController;
