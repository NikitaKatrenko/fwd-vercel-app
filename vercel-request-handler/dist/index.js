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
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "07cd7340111c44ae06474c157fba2b7c",
    secretAccessKey: "44a0fb9959eb0252922a0803b0bd67d3214defa19cf665e6a7ecaf914369fe52",
    endpoint: "https://89bb657e4b923354f8995c30221588a6.r2.cloudflarestorage.com"
});
const app = (0, express_1.default)();
app.get('/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = req.hostname;
        const id = host.split('.')[0];
        const filePath = req.path;
        const content = yield s3.getObject({
            Bucket: "vercel",
            Key: `dist/${id}${filePath}`
        }).promise();
        console.log(host, id, filePath);
        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
        res.set("Content-Type", type);
        res.send(content.Body);
    }
    catch (e) {
        if (e.statusCode === 404) {
            // handle item doesn't exist
            res.status(404).send("Not found");
        }
    }
}));
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
