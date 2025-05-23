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
const rootRouter = (0, express_1.Router)();
rootRouter.use('/auth', auth_1.default);
rootRouter.use('/member', members_1.default);
rootRouter.use('/labour', labours_1.default);
rootRouter.use('/vehicle', vehicle_1.default);
rootRouter.use('/meeting', meeting_1.default);
exports.default = rootRouter;
