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
exports.getDataAnalysis = void 0;
const __1 = require("../..");
const zod_1 = require("zod");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const dateSchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid start date",
    }),
    endDate: zod_1.z.coerce.date({
        required_error: "End date is required",
        invalid_type_error: "Invalid end date",
    }),
});
const getMemberStat = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const newMembersCont = yield __1.prismaClient.members.count({
        where: {
            doj: {
                gte: startDate,
                lte: endDate
            },
            approvalStatus: "APPROVED"
        }
    });
    const membersJoinCountByMonth = yield __1.prismaClient.$queryRaw `
            SELECT DATE_FORMAT(doj, '%Y-%m') AS month_year, COUNT(id) AS count
            FROM members
            WHERE approvalStatus = 'APPROVED' AND doj BETWEEN ${startDate} AND ${endDate}
            GROUP BY month_year
            ORDER BY month_year;`;
    const memberCountsByStatus = yield __1.prismaClient.members.groupBy({
        by: ['membershipStatus'],
        _count: {
            id: true,
        },
        where: {
            doj: {
                gte: startDate, // e.g., new Date('2025-01-01')
                lte: endDate // e.g., new Date('2025-12-31')
            },
            approvalStatus: 'APPROVED' // optional, based on your need
        },
    });
    return {
        newMembersCont,
        membersJoinCountByMonth,
        memberCountsByStatus
    };
});
const vehicleStats = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleCountsByStatus = yield __1.prismaClient.vehicles.groupBy({
        by: ['status'],
        _count: {
            id: true,
        },
    });
    const tripsInRange = yield __1.prismaClient.tripRecords.findMany({
        where: {
            tripDate: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            id: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true
        }
    });
    // Calculate sums
    const tripsTotalAmount = tripsInRange.reduce((sum, trip) => sum + Number(trip.totalAmount || 0), 0);
    const tripsAmountPaid = tripsInRange.reduce((sum, trip) => sum + Number(trip.amountPaid || 0), 0);
    const tripsBalanceAmount = tripsInRange.reduce((sum, trip) => sum + Number(trip.balanceAmount || 0), 0);
    const trips = yield __1.prismaClient.tripRecords.findMany({
        where: {
            tripDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            tripDate: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true,
        },
    });
    const monthlyStats = {};
    for (const trip of trips) {
        const date = new Date(trip.tripDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = {
                numberOfTrips: 0,
                totalAmount: 0,
                amountPaid: 0,
                balanceAmount: 0,
            };
        }
        monthlyStats[monthYear].numberOfTrips += 1;
        monthlyStats[monthYear].totalAmount += Number(trip.totalAmount || 0);
        monthlyStats[monthYear].amountPaid += Number(trip.amountPaid || 0);
        monthlyStats[monthYear].balanceAmount += Number(trip.balanceAmount || 0);
    }
    // Optional: Convert to array
    const result = Object.entries(monthlyStats).map(([monthYear, data]) => (Object.assign({ monthYear }, data)));
    return {
        vehicleCountsByStatus,
        tripsTotalAmount,
        tripsAmountPaid,
        tripsBalanceAmount,
        monthlyStats: result
    };
});
const labourStats = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Count active labours (status: 'ACTIVE')
    const activeLaboursCount = yield __1.prismaClient.labours.count({
        where: {
            labourStatus: 'ACTIVE',
        },
    });
    // Count inactive labours (status: 'INACTIVE')
    const inactiveLaboursCount = yield __1.prismaClient.labours.count({
        where: {
            labourStatus: 'INACTIVE',
        },
    });
    // Count labours on bench (assignedTo is null)
    const onBenchLaboursCount = yield __1.prismaClient.labours.count({
        where: {
            assignedTo: null,
        },
    });
    const historyData = yield __1.prismaClient.labourHistory.findMany({
        where: {
            AND: [
                { fromDate: { lte: endDate } },
                {
                    OR: [
                        { toDate: null },
                        { toDate: { gte: startDate } },
                    ]
                }
            ]
        },
        select: {
            labourStatus: true,
            fromDate: true,
            toDate: true,
        }
    });
    const monthlyStatusMap = {};
    for (const record of historyData) {
        const { fromDate, toDate, labourStatus } = record;
        // Clamp start and end to user-specified range
        let current = new Date(Math.max(startDate.getTime(), new Date(fromDate).getTime()));
        const end = new Date(Math.min(endDate.getTime(), toDate ? new Date(toDate).getTime() : endDate.getTime()));
        // Normalize current to start of month
        current = new Date(current.getFullYear(), current.getMonth(), 1);
        while (current <= end) {
            const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyStatusMap[key]) {
                monthlyStatusMap[key] = { ACTIVE: 0, INACTIVE: 0, ON_BENCH: 0 };
            }
            monthlyStatusMap[key][labourStatus] += 1;
            // Move to first of next month
            current.setMonth(current.getMonth() + 1);
        }
    }
    const historyDataBasedOnMember = yield __1.prismaClient.labourHistory.findMany({
        where: {
            AND: [
                { fromDate: { lte: endDate } },
                {
                    OR: [
                        { toDate: null },
                        { toDate: { gte: startDate } },
                    ]
                },
                { assignedTo: { not: null } }
            ]
        },
        select: {
            assignedTo: true,
            labourStatus: true,
            fromDate: true,
            toDate: true,
            members: {
                select: {
                    firmName: true, // Assuming this is how you label members
                }
            }
        }
    });
    const memberCounts = {};
    for (const record of historyDataBasedOnMember) {
        const name = ((_a = record.members) === null || _a === void 0 ? void 0 : _a.firmName) || record.assignedTo || "Unassigned";
        if (!memberCounts[name]) {
            memberCounts[name] = 0;
        }
        memberCounts[name] += 1;
    }
    return {
        activeLaboursCount,
        inactiveLaboursCount,
        onBenchLaboursCount,
        monthlyStatusMap,
        memberCounts
    };
});
const conplianceStats = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
});
const getDataAnalysis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parseResult = dateSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Invalid date input", errors: parseResult.error.errors });
        }
        const { startDate, endDate } = parseResult.data;
        const membersTotalAmount = yield __1.prismaClient.memberBillingHistory.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                fromDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const vehiclesTotalAmount = yield __1.prismaClient.tripRecords.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                tripDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const memberAmount = membersTotalAmount._sum.totalAmount ? Number(membersTotalAmount._sum.totalAmount) : 0;
        const vehicleAmount = vehiclesTotalAmount._sum.totalAmount ? Number(vehiclesTotalAmount._sum.totalAmount) : 0;
        const totalRevenue = memberAmount + vehicleAmount;
        const totalMembersPaidAmount = yield __1.prismaClient.memberBillingHistory.aggregate({
            _sum: {
                paidAmount: true
            },
            where: {
                fromDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const totalVehiclespaidAmount = yield __1.prismaClient.tripRecords.aggregate({
            _sum: {
                amountPaid: true
            },
            where: {
                tripDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const memberPaidAmount = totalMembersPaidAmount._sum.paidAmount ? Number(totalMembersPaidAmount._sum.paidAmount) : 0;
        const vehiclePaidAmount = totalVehiclespaidAmount._sum.amountPaid ? Number(totalVehiclespaidAmount._sum.amountPaid) : 0;
        const totalCollectedAmount = memberPaidAmount + vehiclePaidAmount;
        const totalMembersDueAmount = yield __1.prismaClient.memberBillingHistory.aggregate({
            _sum: {
                dueAmount: true
            },
            where: {
                fromDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const totalVehiclesDueAmount = yield __1.prismaClient.tripRecords.aggregate({
            _sum: {
                balanceAmount: true
            },
            where: {
                tripDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const memberDueAmount = totalMembersDueAmount._sum.dueAmount ? Number(totalMembersDueAmount._sum.dueAmount) : 0;
        const vehicleDueAmount = totalVehiclesDueAmount._sum.balanceAmount ? Number(totalVehiclesDueAmount._sum.balanceAmount) : 0;
        const totalDueAmount = memberDueAmount + vehicleDueAmount;
        const collectionRate = totalCollectedAmount > 0 ? (totalCollectedAmount / totalRevenue) * 100 : 0;
        return res.json(jsonifyBigInt({
            totalRevenue,
            totalCollectedAmount,
            collectionRate,
            totalDueAmount,
            members: yield getMemberStat(startDate, endDate),
            vehicles: yield vehicleStats(startDate, endDate),
            labours: yield labourStats(startDate, endDate),
        }));
    }
    catch (err) {
        console.log(err);
        return next(new bad_request_1.BadRequestsException((err === null || err === void 0 ? void 0 : err.message) || "An error occurred while fetching data analysis", root_1.ErrorCode.UNPROCESSABLE_ENTITY));
    }
});
exports.getDataAnalysis = getDataAnalysis;
function jsonifyBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (_, value) => typeof value === "bigint" ? value.toString() : value));
}
