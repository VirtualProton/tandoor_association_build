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
exports.getOverView = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getOverView = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Members
        const totalMembers = yield __1.prismaClient.members.count();
        const activeMembers = yield __1.prismaClient.members.count({ where: { membershipStatus: "ACTIVE" } });
        const inactiveMembers = yield __1.prismaClient.members.count({ where: { membershipStatus: "INACTIVE" } });
        const cancelledMembers = yield __1.prismaClient.members.count({ where: { membershipStatus: "CANCELLED" } });
        // Vehicles
        const totalVehicles = yield __1.prismaClient.vehicles.count();
        const activeVehicles = yield __1.prismaClient.vehicles.count({ where: { status: "ACTIVE" } });
        const maintenanceVehicles = yield __1.prismaClient.vehicles.count({ where: { status: "MAINTENANCE" } });
        const inactiveVehicles = yield __1.prismaClient.vehicles.count({ where: { status: "INACTIVE" } });
        // Labour
        const totalLabour = yield __1.prismaClient.labours.count();
        const activeLabour = yield __1.prismaClient.labours.count({ where: { labourStatus: "ACTIVE" } });
        const onBenchLabour = yield __1.prismaClient.labours.count({ where: { assignedTo: null } });
        const inactiveLabour = yield __1.prismaClient.labours.count({ where: { labourStatus: "INACTIVE" } });
        res.json({
            members: {
                total: totalMembers,
                active: activeMembers,
                inactive: inactiveMembers,
                cancelled: cancelledMembers,
            },
            vehicles: {
                total: totalVehicles,
                active: activeVehicles,
                maintenance: maintenanceVehicles,
                inactive: inactiveVehicles
            },
            labour: {
                total: totalLabour,
                active: activeLabour,
                onBench: onBenchLabour,
                inactive: inactiveLabour,
            },
        });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err === null || err === void 0 ? void 0 : err.message, root_1.ErrorCode.UNPROCESSABLE_ENTITY));
    }
});
exports.getOverView = getOverView;
