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
exports.updateMeeting = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateMeeting_1 = require("../../schema/meeting/updateMeeting");
const updateMeeting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = updateMeeting_1.partialMeetingSchema.parse(req.body), { id, attendees, newFollowUpMeeting, deleteFollowUpMeeting } = _a, meetingData = __rest(_a, ["id", "attendees", "newFollowUpMeeting", "deleteFollowUpMeeting"]);
    try {
        console.log("attendees", attendees);
        console.log("New Follow Up Meetings:", newFollowUpMeeting);
        console.log("Delete Follow Up Meetings:", deleteFollowUpMeeting);
        console.log("Meeting Data:", meetingData);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Update the meeting details
            if (deleteFollowUpMeeting && deleteFollowUpMeeting.length > 0) {
                yield prisma.followUpMeeting.deleteMany({
                    where: {
                        id: {
                            in: deleteFollowUpMeeting.map((item) => item),
                        },
                        meetId: id,
                    },
                });
            }
            if (newFollowUpMeeting && newFollowUpMeeting.length > 0) {
                yield prisma.followUpMeeting.createMany({
                    data: newFollowUpMeeting.map((item) => ({ meetId: id, dateTime: item.dateTime })),
                });
            }
            yield meetingAttendeesHandler(prisma, attendees, id);
            if (meetingData) {
                yield prisma.meetings.update({
                    where: { id: id },
                    data: meetingData,
                });
            }
            res.status(200).json({
                message: "Meeting successfully updated",
            });
        }));
    }
    catch (error) {
        console.error("Error updating meeting:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateMeeting = updateMeeting;
const meetingAttendeesHandler = (prisma, attendees, meetId) => __awaiter(void 0, void 0, void 0, function* () {
    const { memberAttendees, vehicleAttendees, labourAttendees } = attendees;
    if (memberAttendees) {
        const { newZone, deleteZone, newMandal, deleteMandal, all, allExecutives, newCustom, deleteCustom } = memberAttendees;
        if (all) {
            yield prisma.memberAttendees.update({
                where: { id: meetId },
                data: {
                    all: true,
                    customMembers: [],
                    zones: [],
                    mandals: [],
                    allExecutives: false
                }
            });
        }
        else if (allExecutives) {
            yield prisma.memberAttendees.update({
                where: { id: meetId },
                data: {
                    all: false,
                    customMembers: { set: [] },
                    zones: { set: [] },
                    mandals: { set: [] },
                    allExecutives: true
                }
            });
        }
        else {
            if (deleteZone && deleteZone.length > 0) {
                yield prisma.zone.deleteMany({
                    where: {
                        id: {
                            in: deleteZone.map((item) => item),
                        },
                        meetId: meetId,
                    },
                });
            }
            if (newZone && newZone.length > 0) {
                yield prisma.memberAttendees.create({
                    zones: {
                        create: newZone.map((item) => ({ zone: item }))
                    },
                    where: { meetId: meetId }
                });
            }
            if (deleteMandal && deleteMandal.length > 0) {
                yield prisma.mandal.deleteMany({
                    where: {
                        id: {
                            in: deleteMandal.map((item) => item),
                        },
                        meetId: meetId,
                    },
                });
            }
            if (newMandal && newMandal.length > 0) {
                yield prisma.memberAttendees.create({
                    mandals: {
                        create: newMandal.map((item) => ({ mandal: item }))
                    },
                    where: { meetId: meetId }
                });
            }
            if (deleteCustom && deleteCustom.length > 0) {
                yield prisma.customMember.deleteMany({
                    where: {
                        id: {
                            in: deleteCustom.map((item) => item),
                        },
                        meetId: meetId,
                    },
                });
            }
            if (newCustom && newCustom.length > 0) {
                yield prisma.memberAttendees.create({
                    customMembers: {
                        create: newCustom.map((item) => ({ membershipId: item }))
                    },
                    where: { meetId: meetId }
                });
            }
        }
    }
});
