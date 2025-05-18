"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@bull-board/express");
const api_1 = require("@bull-board/api");
// @ts-ignore - until properly exported
const bullMQ_1 = require("@bull-board/api/dist/src/queues/bullMQ");
const billingQueue_1 = require("../queues/billingQueue");
const serverAdapter = new express_1.ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
(0, api_1.createBullBoard)({
    queues: [new bullMQ_1.BullMQAdapter(billingQueue_1.billingQueue)],
    serverAdapter,
});
exports.default = serverAdapter;
