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
exports.addTrip = void 0;
const __1 = require("../..");
const addTrip_1 = require("../../schema/Vehicle.ts/addTrip");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const addTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tripDetails = addTrip_1.AddTripSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newTrip = yield addTripHandler(prisma, tripDetails);
            return newTrip;
        }));
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Error adding trip:", e);
        // Handle specific error cases if needed
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addTrip = addTrip;
const addTripHandler = (prisma, tripDetails) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tripRecords.create({
        data: Object.assign({}, tripDetails),
    });
});
