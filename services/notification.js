"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMsg = void 0;
const secrets_1 = require("../secrets");
const accountSid = secrets_1.SID;
const authToken = secrets_1.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sendMsg = () => {
    client.messages
        .create({
        from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+918639621753'
    })
        .then((message) => console.log(message.sid))
        .done();
};
exports.sendMsg = sendMsg;
