"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const members_1 = __importDefault(require("./members"));
const labours_1 = __importDefault(require("./labours"));
const vehicle_1 = __importDefault(require("./vehicle"));
const meeting_1 = __importDefault(require("./meeting"));
const healthCheck_1 = __importDefault(require("./healthCheck"));
const bill_1 = __importDefault(require("./bill"));
const leaseQuery_1 = __importDefault(require("./leaseQuery"));
const taxInvoice_1 = __importDefault(require("./taxInvoice"));
const user_1 = __importDefault(require("./user"));
const dashBoard_1 = __importDefault(require("./dashBoard"));
const analytics_1 = __importDefault(require("./analytics"));
// This file defines the root router for the application, which aggregates all the individual route modules.
// It imports the necessary route modules and sets up the root router to use them.
const rootRouter = (0, express_1.Router)();
rootRouter.use('/auth', auth_1.default);
rootRouter.use('/member', members_1.default);
rootRouter.use('/labour', labours_1.default);
rootRouter.use('/vehicle', vehicle_1.default);
rootRouter.use('/meeting', meeting_1.default);
rootRouter.use('/health', healthCheck_1.default);
rootRouter.use('/bill', bill_1.default);
rootRouter.use('/lease_query', leaseQuery_1.default);
rootRouter.use('/tax_invoice', taxInvoice_1.default);
rootRouter.use('/user', user_1.default);
rootRouter.use('/dashboard', dashBoard_1.default);
rootRouter.use('/analytics', analytics_1.default);
exports.default = rootRouter;
