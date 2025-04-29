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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER;
const client = new twilio_1.Twilio(accountSid, authToken);
function sendBulkWhatsAppNotifications(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const msg of messages) {
            try {
                const response = yield client.messages.create({
                    from: whatsappFrom,
                    to: `whatsapp:${msg.to}`,
                    body: msg.message
                });
                console.log(`✅ Message sent to ${msg.to}: SID ${response.sid}`);
            }
            catch (error) {
                console.error(`❌ Failed to send message to ${msg.to}:`, error);
            }
        }
    });
}
