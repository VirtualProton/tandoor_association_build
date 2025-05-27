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
exports.scheduleMeeting = void 0;
const __1 = require("../..");
const scheduleMeeting_1 = require("../../schema/meeting/scheduleMeeting");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const scheduleMeeting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const meetingDetails = scheduleMeeting_1.MeetingSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newMeeting = yield scheduleMeetingHandler(prisma, meetingDetails, req.user);
            const meetingAttendees = yield meetingAttendeesHandler(prisma, meetingDetails.attendees, newMeeting.id);
            return { newMeeting, meetingAttendees };
        }));
        res.status(200).json(result);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.scheduleMeeting = scheduleMeeting;
const scheduleMeetingHandler = (prisma, meetingDetails, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.meetings.create({
        data: {
            title: meetingDetails.title,
            agenda: meetingDetails.agenda,
            notes: meetingDetails.notes,
            startTime: meetingDetails.startTime,
            endTime: meetingDetails.endTime,
            location: meetingDetails.location,
            createdBy: user.userId,
            attendees: meetingDetails.attendees,
        },
    });
});
const meetingAttendeesHandler = (prisma, attendees, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    let allAttendees = {};
    if (attendees.memberAttendees) {
        let meetingAttendees = [];
        if (attendees.memberAttendees.all) {
            const allMembers = yield prisma.members.findMany({
                where: {
                    membershipStatus: {
                        not: "CANCELLED",
                    },
                },
                select: {
                    membershipId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...allMembers];
        }
        else {
            if (attendees.memberAttendees.zone.length > 0) {
                const zoneMembers = yield prisma.members.findMany({
                    where: {
                        zone: { in: attendees.memberAttendees.zone },
                        membershipStatus: { not: "CANCELLED" },
                    },
                    select: {
                        membershipId: true,
                    },
                });
                meetingAttendees = [...meetingAttendees, ...zoneMembers];
            }
            else if (attendees.memberAttendees.allExecutives) {
                const allExecutives = yield prisma.members.findMany({
                    where: {
                        membershipStatus: { not: "CANCELLED" },
                        similarMembershipInquiry: {
                            some: {
                                is_executive_member: "TRUE",
                            },
                        },
                    },
                    select: {
                        membershipId: true,
                    },
                });
                // Map to match the expected structure
                const allExecutivesMapped = allExecutives.map((exec) => ({
                    membershipId: exec.membershipId,
                }));
                meetingAttendees = [...meetingAttendees, ...allExecutivesMapped];
            }
            else if (attendees.memberAttendees.custom.length > 0) {
                const customMembers = yield prisma.members.findMany({
                    where: {
                        membershipId: { in: attendees.memberAttendees.custom },
                    },
                    select: {
                        membershipId: true,
                    },
                });
                meetingAttendees = [...meetingAttendees, ...customMembers];
            }
        }
        allAttendees["memberAttendees"] = yield prisma.meetingAttendees.createMany({
            data: meetingAttendees.map((meetingAttendee) => ({
                meetingId: meetingId,
                memberId: meetingAttendee.membershipId,
            })),
        });
    }
    if (attendees.vehicleAttendees) {
        let meetingAttendees = [];
        if (attendees.vehicleAttendees.all) {
            const allVehicles = yield prisma.vehicles.findMany({
                where: {
                    status: {
                        not: "INACTIVE",
                    },
                },
                select: {
                    vehicleId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...allVehicles];
        }
        else if (attendees.vehicleAttendees.custom.length > 0) {
            const customVehicles = yield prisma.vehicles.findMany({
                where: {
                    vehicleId: { in: attendees.vehicleAttendees.custom },
                },
                select: {
                    vehicleId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...customVehicles];
        }
        allAttendees["vehicleAttendees"] = yield prisma.meetingAttendees.createMany({
            data: meetingAttendees.map((meetingAttendee) => ({
                meetingId: meetingId,
                vehicleId: meetingAttendee.vehicleId,
                vehicleRole: (attendees.vehicleAttendees.owner && attendees.vehicleAttendees.driver) ? "BOTH" : attendees.vehicleAttendees.owner ? "OWNER" : "DRIVER",
            })),
        });
    }
    if (attendees.labourAttendees) {
        let meetingAttendees = [];
        if (attendees.labourAttendees.all) {
            const allLabours = yield prisma.labours.findMany({
                where: {
                    isActive: {
                        not: "INACTIVE",
                    }
                },
                select: {
                    labourId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...allLabours];
        }
        else if (attendees.labourAttendees.membershipID.length > 0) {
            const LaboursByMember = yield prisma.labours.findMany({
                where: {
                    labourId: { in: attendees.labourAttendees.membershipID },
                },
                select: {
                    labourId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...LaboursByMember];
        }
        else if (attendees.labourAttendees.custom.length > 0) {
            const customLabours = yield prisma.labours.findMany({
                where: {
                    labourId: { in: attendees.labourAttendees.custom },
                },
                select: {
                    labourId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...customLabours];
        }
        allAttendees["labourAttendees"] = yield prisma.meetingAttendees.createMany({
            data: meetingAttendees.map((meetingAttendee) => ({
                meetingId: meetingId,
                labourId: meetingAttendee.labourId,
            })),
        });
    }
    return allAttendees;
});
