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
exports.getAllBenchedLabours = exports.getAllInactiveLabours = exports.getAllActiveLabours = void 0;
const client_1 = require("@prisma/client");
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const prisma = new client_1.PrismaClient();
const getAllActiveLabours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (![
            "ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER",
        ].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const labours = yield __1.prismaClient.labours.findMany({
            where: {
                isActive: "TRUE",
            },
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
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(labours);
    }
    catch (error) {
        console.error("Error fetching active labours:", error);
        next(new bad_request_1.BadRequestsException("Failed to fetch labours", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.getAllActiveLabours = getAllActiveLabours;
const getAllInactiveLabours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (![
            "ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER",
        ].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const labours = yield __1.prismaClient.labours.findMany({
            where: {
                isActive: "FALSE",
            },
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
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(labours);
    }
    catch (error) {
        console.error("Error fetching active labours:", error);
        next(new bad_request_1.BadRequestsException("Failed to fetch labours", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.getAllInactiveLabours = getAllInactiveLabours;
const getAllBenchedLabours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (![
            "ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER",
        ].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const labours = yield __1.prismaClient.labours.findMany({
            where: {
                OR: [{ isActive: "TRUE" }, { onBench: "TRUE" }],
            },
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
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(labours);
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException("Failed to fetch labours", root_1.ErrorCode.SERVER_ERROR));
    }
});
exports.getAllBenchedLabours = getAllBenchedLabours;
