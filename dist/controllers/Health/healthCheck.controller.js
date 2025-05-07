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
exports.healthCheck = void 0;
const client_1 = require("@prisma/client");
const os_1 = __importDefault(require("os"));
const diskusage_1 = __importDefault(require("diskusage"));
const prisma = new client_1.PrismaClient();
const ioredis_1 = __importDefault(require("ioredis"));
const os_utils_1 = __importDefault(require("os-utils"));
const redis = new ioredis_1.default(); // Connect to Redis server
// redis.on("error", (err) => {
//   console.error("Redis error:", err);
// });
// (async () => {
//     try{
//         await redis.connect();
//         console.log("Connected to Redis server"); 
//     }catch (error) {
//         console.error("Error connecting to Redis server:", error);
//     }
//   })();
const checkRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pong = yield redis.ping();
        return pong === "PONG" ? { ok: true, message: 'Redis connected' } : { ok: false, message: 'Redis ping failed' };
    }
    catch (error) {
        console.error("Error connecting to Redis server:", error);
        return { ok: false, message: 'Redis not connected', error: error.message };
    }
});
const checkPrismaDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$queryRawUnsafe("SELECT 1"); // Simple query to check connection
        return { ok: true, message: 'Database connected via Prisma' };
    }
    catch (error) {
        console.error("Error connecting to Prisma DB:", error);
        return { ok: false, message: 'Database connection failed', error: error.message };
    }
});
const checkDiskUsage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = os_1.default.platform() === 'win32' ? 'C:' : '/';
        const { available, free, total } = yield diskusage_1.default.check(path);
        return { ok: true, message: 'Disk usage checked', available, free, total };
    }
    catch (error) {
        console.error("Error checking disk usage:", error);
        return { ok: false, message: 'Disk usage check failed', error: error.message };
    }
});
const healthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const memoryUsage = process.memoryUsage();
    const dbStatus = yield checkPrismaDB();
    const redisStatus = yield checkRedis();
    const diskStatus = yield checkDiskUsage();
    os_utils_1.default.cpuUsage((cpuPercent) => {
        const health = {
            status: dbStatus.ok && redisStatus.ok && diskStatus.ok ? 'OK' : 'DEGRADED',
            uptime: process.uptime(),
            timestamp: new Date(),
            memoryUsage: {
                rss: memoryUsage.rss,
                heapTotal: memoryUsage.heapTotal,
                heapUsed: memoryUsage.heapUsed,
                external: memoryUsage.external,
            },
            cpuUsage: {
                cpuPercent: Math.round(cpuPercent * 100),
                loadavg: os_1.default.loadavg(),
                cpus: os_1.default.cpus(),
            },
            disk: diskStatus,
            redis: redisStatus,
            db: dbStatus,
            environment: process.env.NODE_ENV || 'development',
        };
        const statusCode = health.status === 'OK' ? 200 : 503;
        return res.json(health);
    });
});
exports.healthCheck = healthCheck;
