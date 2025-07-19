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
exports.prismaClient = exports.redis = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const route_1 = __importDefault(require("./routes/route"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const app = (0, express_1.default)(); // Connect to Redis server
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("combined", {
    stream: {
        write: (message) => logger_1.default.info(message.trim())
    }
}));
app.get('/', (req, res) => {
    res.send('API is working. CORS is enabled for all origins.');
});
app.use('/api', route_1.default);
exports.redis = new ioredis_1.default(secrets_1.REDIS_URL);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query']
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT || 8000, () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.redis.flushall();
    console.log("APP is working");
}));
