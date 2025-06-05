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
exports.generateMeetID = generateMeetID;
function generateMeetID(prismaClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear();
        const tracker = yield prismaClient.meetIdTracker.upsert({
            where: { year: currentYear },
            update: { counter: { increment: 1 } },
            create: { year: currentYear, counter: 1 },
        });
        const padded = String(tracker.counter).padStart(3, '0');
        return `MEET${currentYear}-${padded}`;
    });
}
