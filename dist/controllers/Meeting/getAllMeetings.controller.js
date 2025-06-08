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
exports.upcomingMeetings = exports.getMeetingById = exports.getAllMeetings = void 0;
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const __1 = require("../..");
const getAllMeetings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!["ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const meetings = yield __1.prismaClient.meetings.findMany({
            orderBy: {
                startTime: 'desc', // or 'asc'
            }
        });
        res.status(200).json({ message: "Meetings retrieved successfully", data: meetings });
    }
    catch (error) {
        console.error("Error in getAllMeetings:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllMeetings = getAllMeetings;
const getMeetingById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetId } = req.params;
        if (!["ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const meetings = yield __1.prismaClient.meetings.findMany({
            where: {
                meetId
            }
        });
        res.status(200).json({ message: "Meetings retrieved successfully", data: meetings });
    }
    catch (error) {
        console.error("Error in getAllMeetings:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getMeetingById = getMeetingById;
const upcomingMeetings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!["ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const now = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(now.getDate() + 7);
        // 1. Get Meetings directly scheduled within the next 7 days
        const primaryMeetings = yield __1.prismaClient.meetings.findMany({
            where: {
                startTime: {
                    gte: now,
                    lte: sevenDaysLater,
                },
            },
            include: {
                followUpMeetings: true,
            },
        });
        // 2. Get FollowUpMeetings within the next 7 days
        const followUpMeetings = yield __1.prismaClient.followUpMeeting.findMany({
            where: {
                dateTime: {
                    gte: now,
                    lte: sevenDaysLater,
                },
            },
            include: {
                meeting: true,
            },
        });
        // 3. Normalize both sets to a common structure
        const mainMeetingEvents = primaryMeetings.map(m => ({
            type: 'MAIN',
            meetingId: m.meetId,
            title: m.title,
            agenda: m.agenda,
            time: m.startTime,
            source: m,
        }));
        const followUpMeetingEvents = followUpMeetings.map(f => ({
            type: 'FOLLOW_UP',
            meetingId: f.meeting.meetId,
            title: f.meeting.title,
            agenda: f.meeting.agenda,
            time: f.dateTime,
            source: f,
        }));
        // 4. Merge and sort by time
        const upcomingMeetings = [...mainMeetingEvents, ...followUpMeetingEvents].sort((a, b) => a.time.getTime() - b.time.getTime());
        res.status(200).json({ message: "Upcoming meetings retrieved successfully", data: upcomingMeetings });
    }
    catch (error) {
        console.error("Error in upcomingMeetings:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.upcomingMeetings = upcomingMeetings;
