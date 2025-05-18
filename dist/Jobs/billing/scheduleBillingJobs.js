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
exports.scheduleBillingJobs = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const billingQueue_1 = require("../queues/billingQueue");
const prisma = new client_1.PrismaClient();
const scheduleBillingJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const targetStart = (0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(new Date(), 7));
    const targetEnd = (0, date_fns_1.endOfDay)((0, date_fns_1.addDays)(new Date(), 7));
    const membersDueSoon = yield prisma.members.findMany({
        where: {
            nextDueDate: {
                gte: targetStart,
                lte: targetEnd,
            },
            membershipStatus: 'ACTIVE',
        },
        select: {
            membershipId: true,
        },
    });
    for (const member of membersDueSoon) {
        yield billingQueue_1.billingQueue.add('generate-bill', { membershipId: member.membershipId }, {
            attempts: 3,
            backoff: {
                type: 'fixed',
                delay: 60000, // 1 minute retry delay
            },
        });
    }
    console.log(`Queued ${membersDueSoon.length} billing jobs.`);
});
exports.scheduleBillingJobs = scheduleBillingJobs;
