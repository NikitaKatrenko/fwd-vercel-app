import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "07cd7340111c44ae06474c157fba2b7c",
    secretAccessKey: "44a0fb9959eb0252922a0803b0bd67d3214defa19cf665e6a7ecaf914369fe52",
    endpoint: "https://89bb657e4b923354f8995c30221588a6.r2.cloudflarestorage.com"
})

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();

    console.log(response);
}