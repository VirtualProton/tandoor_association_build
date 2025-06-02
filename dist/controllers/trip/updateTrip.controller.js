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
exports.updateTrip = void 0;
const __1 = require("../..");
const updateTrip_1 = require("../../schema/Vehicle.ts/updateTrip");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateTrip = updateTrip_1.updateTripSchema.parse(req.body);
        // Exclude tripId from the update data
        const { tripId } = updateTrip, updateData = __rest(updateTrip, ["tripId"]);
        if (updateTrip.amountPerTrip ||
            updateTrip.numberOfTrips ||
            updateTrip.amountPaid) {
            const updatedTrip = yield __1.prismaClient.tripRecords.update({
                where: { tripId },
                data: Object.assign(Object.assign({}, updateData), { modifiedBy: req.user.userId }),
            });
            const tripDetails = yield __1.prismaClient.tripRecords.findUnique({
                where: { tripId: updateTrip.tripId },
            });
            const totalAmount = (tripDetails === null || tripDetails === void 0 ? void 0 : tripDetails.amountPerTrip) * (tripDetails === null || tripDetails === void 0 ? void 0 : tripDetails.numberOfTrips);
            const balanceAmount = totalAmount - (tripDetails === null || tripDetails === void 0 ? void 0 : tripDetails.amountPaid);
            const paymentStatus = balanceAmount == 0 ? "PAID" : balanceAmount == totalAmount ? "UNPAID" : "PARTIAL";
            const finalUpdatedTrip = yield __1.prismaClient.tripRecords.update({
                where: { tripId },
                data: {
                    totalAmount,
                    balanceAmount,
                    paymentStatus,
                },
            });
        }
        else {
            const updatedTrip = yield __1.prismaClient.tripRecords.update({
                where: { tripId },
                data: Object.assign({}, updateData),
            });
        }
        res.status(200).json(`${tripId} updated successfully`);
    }
    catch (error) {
        console.error("Error update trip:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateTrip = updateTrip;
