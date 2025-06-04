"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingSchema = void 0;
const zod_1 = require("zod");
// Helper function to check if an array has values
const hasValues = (arr) => { var _a; return ((_a = arr === null || arr === void 0 ? void 0 : arr.length) !== null && _a !== void 0 ? _a : 0) > 0; };
// Helper function for mutual exclusions (e.g., when `all` is true, `custom` should not be provided)
const validateMutualExclusion = (data, fields, exclusion) => {
    const hasFields = fields.some(field => hasValues(data[field]));
    return !(data[exclusion] && hasFields);
};
// Define a schema for MeetingStatus Enum
const MeetingStatusEnum = zod_1.z.enum(["SCHEDULED", "CANCELLED", "COMPLETED"]);
const followUpMeeting = zod_1.z.object({
    dateTime: zod_1.z.coerce.date().refine((date) => date > new Date(), {
        message: "Meeting date must be in the future",
    }),
});
// Define a schema for member attendees
const memberAttendees = zod_1.z
    .object({
    zone: zod_1.z.array(zod_1.z.string()).optional(),
    mandal: zod_1.z.array(zod_1.z.string()).optional(),
    all: zod_1.z.boolean().optional(),
    allExecutives: zod_1.z.boolean().optional().default(false),
    custom: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => hasValues(data.custom) || data.allExecutives || hasValues(data.zone) || data.all, { message: "At least one of 'zone', 'all', 'allExecutives', 'mandal',  or 'custom' must be provided" })
    .refine((data) => validateMutualExclusion(data, ['zone', 'custom', 'allExecutives', 'mandal'], 'all'), { message: "When 'all' is true, 'zone', 'custom', and 'allExecutives' must not be provided", path: ["all"] });
// Define a schema for vehicle attendees
const vehicleAttendees = zod_1.z
    .object({
    owner: zod_1.z.boolean().optional().default(true),
    driver: zod_1.z.boolean().optional().default(false),
    all: zod_1.z.boolean().optional().default(false),
    custom: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => data.all || hasValues(data.custom), { message: "At least one of 'all' or 'custom' must be provided" })
    .refine((data) => validateMutualExclusion(data, ['custom'], 'all'), { message: "When 'all' is true, 'custom' must not be provided", path: ["all"] });
// Define a schema for labour attendees
const labourAttendees = zod_1.z
    .object({
    all: zod_1.z.boolean().optional(),
    membershipID: zod_1.z.array(zod_1.z.string()).optional(),
    custom: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => data.all || hasValues(data.membershipID) || hasValues(data.custom), { message: "At least one of 'all', 'membershipID', or 'custom' must be provided" })
    .refine((data) => validateMutualExclusion(data, ['membershipID', 'custom'], 'all'), { message: "When 'all' is true, 'membershipID' and 'custom' must not be provided", path: ["all"] });
// Define a schema for attendees (member, vehicle, or labour)
const attendees = zod_1.z
    .object({
    memberAttendees: memberAttendees.optional(),
    vehicleAttendees: vehicleAttendees.optional(),
    labourAttendees: labourAttendees.optional(),
})
    .refine((data) => data.memberAttendees || data.vehicleAttendees || data.labourAttendees, { message: "At least one of 'memberAttendees', 'vehicleAttendees', or 'labourAttendees' must be provided" });
// Define the schema for the meeting
exports.MeetingSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title cannot exceed 255 characters"),
    agenda: zod_1.z.string().min(3, "Agenda must be at least 3 characters long"),
    notes: zod_1.z.string().optional(),
    startTime: zod_1.z.coerce.date().refine((date) => date > new Date(), {
        message: "Meeting date must be in the future",
    }),
    location: zod_1.z.string().max(255).optional(),
    attendees: attendees,
    status: MeetingStatusEnum.default("SCHEDULED"),
    followUpMeeting: zod_1.z.array(followUpMeeting).optional()
});
