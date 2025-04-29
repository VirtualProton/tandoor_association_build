"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
// Redis is running on default localhost:6379
const connection = new ioredis_1.default(); // No config file needed
// Reminder queue
const reminderQueue = new bullmq_1.Queue('meeting-reminders', {
    connection,
});
exports.default = reminderQueue;
