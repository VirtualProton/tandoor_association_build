"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialMeetingSchema = exports.MeetingSchema = exports.MeetingStatusEnum = void 0;
const zod_1 = require("zod");
// Helper function to check if an array has values
const hasValues = (arr) => { var _a; return ((_a = arr === null || arr === void 0 ? void 0 : arr.length) !== null && _a !== void 0 ? _a : 0) > 0; };
// Helper function for mutual exclusions (e.g., when `all` is true, `custom` should not be provided)
const validateMutualExclusion = (data, fields, exclusion) => {
    const hasFields = fields.some(field => hasValues(data[field]));
    return !(data[exclusion] && hasFields);
};
// Define a schema for MeetingStatus Enum
exports.MeetingStatusEnum = zod_1.z.enum(["SCHEDULED", "CANCELLED", "COMPLETED"]);
// Define a schema for member attendees
const memberAttendees = zod_1.z
    .object({
    zone: zod_1.z.array(zod_1.z.string()).optional(),
    all: zod_1.z.boolean().optional(),
    custom: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => hasValues(data.custom) || hasValues(data.zone) || data.all, { message: "At least one of 'zone', 'all', or 'custom' must be provided" })
    .refine((data) => validateMutualExclusion(data, ['zone', 'custom'], 'all'), { message: "When 'all' is true, 'zone' and 'custom' must not be provided", path: ["all"] });
// Define a schema for vehicle attendees
const vehicleAttendees = zod_1.z
    .object({
    all: zod_1.z.boolean().optional(),
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
// Create a base schema for meeting (no .superRefine yet)
const MeetingBaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string()
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title cannot exceed 255 characters"),
    agenda: zod_1.z.string()
        .min(3, "Agenda must be at least 3 characters long"),
    notes: zod_1.z.string().optional(),
    startTime: zod_1.z.coerce.date()
        .refine((date) => date > new Date(), { message: "Meeting date must be in the future" }),
    endTime: zod_1.z.coerce.date(),
    location: zod_1.z.string().max(255).optional(),
    attendees: attendees,
});
// Full meeting schema
exports.MeetingSchema = MeetingBaseSchema.superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["endTime"],
            message: "End time must be after start time",
        });
    }
});
// Partial meeting schema: everything optional EXCEPT `id`
exports.partialMeetingSchema = MeetingBaseSchema.partial().extend({
    id: zod_1.z.string(), // id must still be required
});
// // (Optional) Export TS types if needed
// export type Meeting = z.infer<typeof MeetingSchema>;
// export type PartialMeeting = z.infer<typeof partialMeetingSchema>;
