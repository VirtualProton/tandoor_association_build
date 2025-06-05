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
exports.scheduleMeeting = void 0;
const __1 = require("../..");
const scheduleMeeting_1 = require("../../schema/meeting/scheduleMeeting");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const generateMeetID_1 = require("../../utils/generateMeetID");
const scheduleMeeting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const meetingDetails = scheduleMeeting_1.MeetingSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        console.log(meetingDetails);
        const { attendees, followUpMeeting } = meetingDetails, meetingData = __rest(meetingDetails, ["attendees", "followUpMeeting"]);
        console.log("attendees", attendees);
        console.log("followUpMeeting", followUpMeeting);
        console.log("meetingData", meetingData);
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newMeeting = yield scheduleMeetingHandler(prisma, meetingData, attendees, req.user);
            const newFollowUpMeeting = yield followUpMeetingHandler(prisma, followUpMeeting, newMeeting.meetId);
            const meetingAttendees = yield meetingAttendeesHandler(prisma, attendees, newMeeting.meetId);
            return { newMeeting, newFollowUpMeeting, meetingAttendees };
        }));
        res.status(200).json(result);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.scheduleMeeting = scheduleMeeting;
const scheduleMeetingHandler = (prisma, meetingDetails, attendees, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.meetings.create({
        data: Object.assign(Object.assign({ meetId: yield (0, generateMeetID_1.generateMeetID)(prisma) }, meetingDetails), { attendees: attendees, createdBy: user.userId }),
    });
});
const followUpMeetingHandler = (prisma, followUpMeeting, meetId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.followUpMeeting.createMany({
        data: followUpMeeting.map((item) => ({
            meetId: meetId,
            dateTime: new Date(item.dateTime)
        }))
    });
});
const meetingAttendeesHandler = (prisma, attendees, meetId) => __awaiter(void 0, void 0, void 0, function* () {
    const { memberAttendees, vehicleAttendees, labourAttendees } = attendees;
    //Member
    if (memberAttendees) {
        if (memberAttendees.all) {
            const allMembers = yield prisma.members.findMany({
                where: {
                    membershipStatus: "ACTIVE"
                },
                select: {
                    membershipId: true,
                },
            });
            yield prisma.meetingAttendees.createMany({
                data: allMembers.map((item) => ({
                    meetId: meetId,
                    membershipId: item.membershipId,
                }))
            });
        }
        else {
            let members = [];
            if (memberAttendees.zone && memberAttendees.zone.length > 0) {
                const zoneMembers = yield prisma.members.findMany({
                    where: {
                        membershipStatus: "ACTIVE",
                        zone: { in: memberAttendees.zone }
                    },
                    select: {
                        membershipId: true,
                    },
                });
                members.push(...zoneMembers);
            }
            if (memberAttendees.mandal && memberAttendees.mandal.length > 0) {
                const mandalMembers = yield prisma.members.findMany({
                    where: {
                        membershipStatus: "ACTIVE",
                        mandal: { in: memberAttendees.mandal }
                    },
                    select: {
                        membershipId: true,
                    },
                });
                members.push(...mandalMembers);
            }
            if (memberAttendees.allExecutives) {
                const allExecutivesMembers = yield prisma.members.findMany({
                    where: {
                        membershipStatus: "ACTIVE",
                        similarMembershipInquiry: {
                            is: {
                                is_executive_member: "TRUE"
                            }
                        }
                    },
                    select: {
                        membershipId: true
                    }
                });
                members.push(...allExecutivesMembers);
            }
            if (memberAttendees.custom && memberAttendees.custom.length > 0) {
                for (let i = 0; i < memberAttendees.custom.length; i++) {
                    members.push({
                        "membershipId": memberAttendees.custom[i],
                        "isCustom": "TRUE"
                    });
                }
            }
            const uniqueIds = yield removeDuplicateMembershipId(members);
            yield prisma.meetingAttendees.createMany({
                data: uniqueIds.map((item) => ({
                    meetId: meetId,
                    membershipId: item.membershipId,
                    isCustom: item.isCustom ? item.isCustom : "FALSE"
                }))
            });
        }
    }
    //vehicleAttendees
    if (vehicleAttendees) {
        if (vehicleAttendees.all) {
            const allVehicles = yield prisma.vehicles.findMany({
                where: {
                    status: {
                        not: "INACTIVE"
                    }
                },
                select: {
                    vehicleId: true,
                },
            });
            yield prisma.meetingAttendees.createMany({
                data: allVehicles.map((item) => ({
                    meetId: meetId,
                    vehicleId: item.vehicleId,
                    vehicleRole: (vehicleAttendees.owner && vehicleAttendees.driver) ? "BOTH" : vehicleAttendees.driver ? "DRIVER" : "OWNER"
                }))
            });
        }
        if (vehicleAttendees.custom && vehicleAttendees.custom.length > 0) {
            yield prisma.meetingAttendees.createMany({
                data: vehicleAttendees.custom.map((item) => ({
                    meetId: meetId,
                    vehicleId: item.vehicleId,
                    vehicleRole: (vehicleAttendees.owner && vehicleAttendees.driver) ? "BOTH" : vehicleAttendees.driver ? "DRIVER" : "OWNER",
                    isCustom: "TRUE"
                }))
            });
        }
    }
    if (labourAttendees) {
        if (labourAttendees.all) {
            const allLabours = yield prisma.labours.findMany({
                where: {
                    labourStatus: "ACTIVE"
                },
                select: {
                    labourId: true
                }
            });
            yield prisma.meetingAttendees.createMany({
                data: allLabours.custom.map((item) => ({
                    meetId: meetId,
                    labourId: item.labourId,
                }))
            });
        }
        else {
            let labours = [];
            if (labourAttendees.membershipID && labourAttendees.membershipID.length > 0) {
                const laboursByMember = yield prisma.labours.findMany({
                    where: {
                        assignedTo: { in: labourAttendees.membershipID }
                    },
                    select: {
                        labourId: true,
                    },
                });
                labours.push(...laboursByMember);
            }
            if (labourAttendees.custom && labourAttendees.custom.length > 0) {
                for (let i = 0; i < labourAttendees.custom.length; i++) {
                    labours.push({
                        labourId: labourAttendees.custom[i],
                        isCustom: "TRUE"
                    });
                }
            }
            console.log(labours);
            const uniqueIds = yield removeDuplicateLabourId(labours);
            yield prisma.meetingAttendees.createMany({
                data: uniqueIds.map((item) => ({
                    meetId: meetId,
                    labourId: item.labourId,
                    isCustom: item.isCustom ? item.isCustom : "FALSE"
                }))
            });
        }
    }
    return;
});
const removeDuplicateMembershipId = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return Array.from(data.reduce((map, item) => {
        const existing = map.get(item.labourId);
        const existingIsCustom = (existing === null || existing === void 0 ? void 0 : existing.isCustom) === 'TRUE';
        const currentIsCustom = (item === null || item === void 0 ? void 0 : item.isCustom) === 'TRUE';
        // Prefer item without isCustom
        if (!existing || (existingIsCustom && !currentIsCustom)) {
            map.set(item.labourId, item);
        }
        return map;
    }, new Map()).values());
});
const removeDuplicateLabourId = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return Array.from(data.reduce((map, item) => {
        const existing = map.get(item.labourId);
        // If no entry exists yet, set it
        if (!existing) {
            map.set(item.labourId, item);
        }
        else {
            // If current isCustom is falsy and existing isCustom is truthy, replace it
            const existingIsCustom = existing.isCustom === 'TRUE';
            const currentIsCustom = item.isCustom === 'TRUE';
            if (existingIsCustom && !currentIsCustom) {
                map.set(item.labourId, item); // Prefer non-custom
            }
        }
        return map;
    }, new Map()).values());
});
