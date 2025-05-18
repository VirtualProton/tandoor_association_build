"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingQueue = void 0;
const bullmq_1 = require("bullmq");
const __1 = require("../..");
const connection = __1.redis;
exports.billingQueue = new bullmq_1.Queue('billing', { connection });
