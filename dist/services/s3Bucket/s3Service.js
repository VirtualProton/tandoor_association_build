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
exports.listFiles = exports.deleteFile = exports.getFileUrl = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
const secrets_1 = require("../../secrets");
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    region: secrets_1.AWS_REGION,
    credentials: {
        accessKeyId: secrets_1.AWS_ACCESS_KEY_ID,
        secretAccessKey: secrets_1.AWS_SECRET_ACCESS_KEY,
    },
});
const BUCKET_NAME = secrets_1.S3_BUCKET_NAME;
const uploadFile = (base64String, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const fileStream = fs.createReadStream(filePath);
        const buffer = Buffer.from(base64String, "base64");
        const command = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentEncoding: "base64",
            ContentType: "image/png"
        });
        yield s3Client.send(command);
        console.log(`File uploaded successfully: ${key}`);
        return key;
    }
    catch (error) {
        console.error("Error uploading file:", error);
    }
});
exports.uploadFile = uploadFile;
const getFileUrl = (key_1, ...args_1) => __awaiter(void 0, [key_1, ...args_1], void 0, function* (key, expiresIn = 3600) {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
        return url;
    }
    catch (error) {
        console.error("Error generating file URL:", error);
    }
});
exports.getFileUrl = getFileUrl;
const deleteFile = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        yield s3Client.send(command);
        console.log(`File deleted: ${key}`);
    }
    catch (error) {
        console.error("Error deleting file:", error);
    }
});
exports.deleteFile = deleteFile;
const listFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: BUCKET_NAME,
        });
        const response = yield s3Client.send(command);
        return ((_a = response.Contents) === null || _a === void 0 ? void 0 : _a.map((file) => file.Key)) || [];
    }
    catch (error) {
        console.error("Error listing files:", error);
    }
});
exports.listFiles = listFiles;
