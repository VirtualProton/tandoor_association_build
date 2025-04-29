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
exports.testS3Operations = void 0;
const s3Service_1 = require("./s3Service");
const testS3Operations = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = "D:/Projects/Tandur_Association/cd.txt"; // Change this to a valid file path
    const fileKey = "uploaded-file.txt";
    // Upload file
    yield (0, s3Service_1.uploadFile)(filePath, fileKey);
    // Get file URL
    const url = yield (0, s3Service_1.getFileUrl)(fileKey);
    console.log("File URL:", url);
    // List files
    // const files = await listFiles();
    // console.log("Files in bucket:", files);
    // // Delete file
    // await deleteFile(fileKey);
    return url;
});
exports.testS3Operations = testS3Operations;
