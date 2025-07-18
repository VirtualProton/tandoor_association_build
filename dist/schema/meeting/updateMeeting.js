"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialMeetingSchema = exports.MeetingStatusEnum = void 0;
const zod_1 = require("zod");
// Helper function to check if an array has values
const hasValues = (arr) => { var _a; return ((_a = arr === null || arr === void 0 ? void 0 : arr.length) !== null && _a !== void 0 ? _a : 0) > 0; };
// Define a schema for MeetingStatus Enum
exports.MeetingStatusEnum = zod_1.z.enum(["SCHEDULED", "CANCELLED", "COMPLETED"]);
// Define a schema for member attendees
const memberAttendees = zod_1.z
    .object({
    newZone: zod_1.z.array(zod_1.z.string()).optional(),
    deleteZone: zod_1.z.array(zod_1.z.number().int()).optional(),
    newMandal: zod_1.z.array(zod_1.z.string()).optional(),
    deleteMandal: zod_1.z.array(zod_1.z.number().int()).optional(),
    allExecutives: zod_1.z.boolean().optional(),
    all: zod_1.z.boolean().optional(),
    newCustom: zod_1.z.array(zod_1.z.string()).optional(),
    deleteCustom: zod_1.z.array(zod_1.z.number().int()).optional(),
});
// Define a schema for vehicle attendees
const vehicleAttendees = zod_1.z
    .object({
    owner: zod_1.z.boolean().optional(),
    driver: zod_1.z.boolean().optional(),
    all: zod_1.z.boolean().optional(),
    newCustom: zod_1.z.array(zod_1.z.string()).optional(),
    deleteCustom: zod_1.z.array(zod_1.z.number().int()).optional(),
});
// Define a schema for labour attendees
const labourAttendees = zod_1.z
    .object({
    all: zod_1.z.boolean().optional(),
    newMembershipID: zod_1.z.array(zod_1.z.string()).optional(),
    deleteMembershipID: zod_1.z.array(zod_1.z.number().int()).optional(),
    newCustom: zod_1.z.array(zod_1.z.string()).optional(),
    deleteCustom: zod_1.z.array(zod_1.z.number().int()).optional(),
});
// Define a schema for attendees (member, vehicle, or labour)
const attendees = zod_1.z
    .object({
    memberAttendees: memberAttendees.optional(),
    vehicleAttendees: vehicleAttendees.optional(),
    labourAttendees: labourAttendees.optional(),
});
const followUpMeeting = zod_1.z.object({
    dateTime: zod_1.z.coerce.date().refine((date) => date > new Date(), {
        message: "Meeting date must be in the future",
    }),
});
// Create a base schema for meeting (no .superRefine yet)
const MeetingUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title cannot exceed 255 characters").optional(),
    agenda: zod_1.z.string().min(3, "Agenda must be at least 3 characters long").optional(),
    notes: zod_1.z.string().optional(),
    startTime: zod_1.z.coerce.date().refine((date) => date > new Date(), {
        message: "Meeting date must be in the future",
    }).optional(),
    location: zod_1.z.string().max(255).optional(),
    attendees: attendees.optional(),
    status: exports.MeetingStatusEnum.optional(),
    newFollowUpMeeting: zod_1.z.array(followUpMeeting).optional().default([]),
    deleteFollowUpMeeting: zod_1.z.array(zod_1.z.number().int()).optional().default([])
});
// Partial meeting schema: everything optional EXCEPT `id`
exports.partialMeetingSchema = MeetingUpdateSchema.partial().extend({
    id: zod_1.z.number().int(), // id must still be required
});
// // (Optional) Export TS types if needed
// export type Meeting = z.infer<typeof MeetingSchema>;
// export type PartialMeeting = z.infer<typeof partialMeetingSchema>;
