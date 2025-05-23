"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const route_1 = __importDefault(require("./routes/route"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("combined", {
    stream: {
        write: (message) => logger_1.default.info(message.trim())
    }
}));
app.get('/', (req, res) => {
    res.send('Working');
});
app.use('/api', route_1.default);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query']
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT || 8000, () => {
    console.log("APP is working");
});
