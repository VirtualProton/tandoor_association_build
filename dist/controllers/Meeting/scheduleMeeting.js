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
            const meetId = yield (0, generateMeetID_1.generateMeetID)(prisma);
            const newMeeting = yield prisma.meetings.create({
                data: Object.assign(Object.assign({ meetId }, meetingData), { createdBy: req.user.userId, followUpMeetings: {
                        create: followUpMeeting.map((item) => ({
                            dateTime: item.dateTime
                        })),
                    } }),
            });
            const newAttendees = yield meetingAttendeesHandler(prisma, attendees, newMeeting.id);
            return res.status(200).json({ message: "Meeting successfully scheduled", data: { newMeeting, newAttendees } });
        }), { timeout: 20000 });
    }
    catch (e) {
        console.log(e);
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.scheduleMeeting = scheduleMeeting;
const meetingAttendeesHandler = (prisma, attendees, meetId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { memberAttendees, vehicleAttendees, labourAttendees } = attendees;
    let newMemberAttendees;
    let newVehicleAttendees;
    let newLabourAttendees;
    if (memberAttendees) {
        if (memberAttendees.all) {
            newMemberAttendees = yield prisma.memberAttendees.create({
                data: {
                    meetId,
                    all: memberAttendees.all
                }
            });
        }
        else {
            newMemberAttendees = yield prisma.memberAttendees.create({
                data: {
                    meetId,
                    allExecutives: memberAttendees.allExecutives ? memberAttendees.allExecutives : false,
                    zones: {
                        create: (_a = memberAttendees.zone) === null || _a === void 0 ? void 0 : _a.map((item) => ({ zone: item }))
                    },
                    mandals: {
                        create: (_b = memberAttendees.mandal) === null || _b === void 0 ? void 0 : _b.map((item) => ({ mandal: item }))
                    },
                    customMembers: {
                        create: (_c = memberAttendees.custom) === null || _c === void 0 ? void 0 : _c.map((item) => ({ membershipId: item }))
                    }
                }
            });
        }
    }
    if (vehicleAttendees) {
        if (vehicleAttendees.all) {
            newVehicleAttendees = yield prisma.vehicleAttendees.create({
                data: {
                    meetId,
                    owner: vehicleAttendees.owner,
                    driver: vehicleAttendees.driver,
                    all: vehicleAttendees.all,
                }
            });
        }
        else {
            newVehicleAttendees = yield prisma.vehicleAttendees.create({
                data: {
                    meetId,
                    owner: vehicleAttendees.owner,
                    driver: vehicleAttendees.driver,
                    all: vehicleAttendees.all,
                    customVehicle: {
                        create: (_d = vehicleAttendees.custom) === null || _d === void 0 ? void 0 : _d.map((item) => ({ vehicleId: item }))
                    }
                }
            });
        }
    }
    if (labourAttendees) {
        if (labourAttendees.all) {
            newLabourAttendees = yield prisma.labourAttendees.create({
                data: {
                    meetId,
                    all: labourAttendees.all,
                }
            });
        }
        else {
            newLabourAttendees = yield prisma.labourAttendees.create({
                data: {
                    meetId,
                    all: labourAttendees.all,
                    membershipIds: {
                        create: (_e = labourAttendees.membershipID) === null || _e === void 0 ? void 0 : _e.map((item) => ({ membershipId: item }))
                    },
                    customLabours: {
                        create: (_f = labourAttendees.custom) === null || _f === void 0 ? void 0 : _f.map((item) => ({ labourId: item }))
                    }
                }
            });
        }
    }
    return {
        newMemberAttendees,
        newVehicleAttendees,
        newLabourAttendees
    };
});
