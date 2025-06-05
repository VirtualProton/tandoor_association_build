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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeeting = void 0;
const lodash_1 = __importDefault(require("lodash"));
const updateMeeting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const updateMeetingDetails = partialMeetingSchema.parse(req.body);
    // try {
    //   if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
    //     return next(
    //       new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED)
    //     );
    //   }
    //   const result = await prismaClient.$transaction(async (prisma) => {
    //     const existingMeeting = await prisma.meetings.findUnique({
    //       where: { id: updateMeetingDetails.id },
    //     });
    //     if (!existingMeeting) {
    //       throw new BadRequestsException(
    //         "Meeting not found",
    //         ErrorCode.NOT_FOUND
    //       );
    //     }
    //     const changes = await calculateFieldDifferences(
    //       existingMeeting,
    //       updateMeetingDetails
    //     );
    //     if (Object.keys(changes).length === 0) {
    //       throw new BadRequestsException(
    //         "No changes detected",
    //         ErrorCode.NO_DATA_PROVIDED
    //       );
    //     }
    //     const updateMeeting = await updateMeetingHandler(
    //       prisma,
    //       changes,
    //       req.user
    //     );
    //     let updateAttendees = null;
    //     if (changes.attendees) {
    //       // Check if the attendees have changed
    //        updateAttendees = await meetingAttendeesHandler(
    //         prisma,
    //         changes.attendees,
    //         updateMeeting.id
    //       );
    //     }
    //     return { updateMeeting, updateAttendees };
    //   });
    //   res.status(200).json(result);
    // } catch (e:any) {
    //   return next(new BadRequestsException(e.message, ErrorCode.SERVER_ERROR));
    // }
});
exports.updateMeeting = updateMeeting;
const updateMeetingHandler = (prisma, updateMeetingDetails, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.meetings.update({
        where: { id: updateMeetingDetails.id },
        data: Object.assign(Object.assign({}, updateMeetingDetails), { updatedBy: user.id }),
    });
});
const meetingAttendeesHandler = (prisma, attendees, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    const del = yield prisma.meetingAttendees.deleteMany({
        where: {
            meetingId: meetingId,
        },
    });
    let allAttendees = {};
    if (attendees.memberAttendees) {
        let meetingAttendees = [];
        if (attendees.memberAttendees.all) {
            const allMembers = yield prisma.members.findMany({
                where: {
                    isActive: "TRUE",
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
                    },
                    select: {
                        membershipId: true,
                    },
                });
                meetingAttendees = [...meetingAttendees, ...zoneMembers];
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
                    isActive: "TRUE",
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
            })),
        });
    }
    if (attendees.labourAttendees) {
        let meetingAttendees = [];
        if (attendees.labourAttendees.all) {
            const allLabours = yield prisma.labours.findMany({
                where: {
                    isActive: "TRUE",
                },
                select: {
                    labourId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...allLabours];
        }
        else if (attendees.labourAttendees.membershipID.length > 0) {
            const customLabours = yield prisma.labours.findMany({
                where: {
                    labourId: { in: attendees.labourAttendees.membershipID },
                },
                select: {
                    labourId: true,
                },
            });
            meetingAttendees = [...meetingAttendees, ...customLabours];
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
function calculateFieldDifferences(existing, incoming) {
    const result = {};
    for (const key in incoming) {
        if (lodash_1.default.isEqual(existing[key], incoming[key]))
            continue;
        result[key] = incoming[key];
    }
    return result;
}
