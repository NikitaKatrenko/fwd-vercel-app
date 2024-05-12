import express from 'express';
import { S3 } from 'aws-sdk';

const s3 = new S3({
    accessKeyId: "07cd7340111c44ae06474c157fba2b7c",
    secretAccessKey: "44a0fb9959eb0252922a0803b0bd67d3214defa19cf665e6a7ecaf914369fe52",
    endpoint: "https://89bb657e4b923354f8995c30221588a6.r2.cloudflarestorage.com"
})

const app = express();

app.get('/*', async (req, res) => {
    try {
        const host = req.hostname;
        const id = host.split('.')[0];
        const filePath = req.path;
        const content = await s3.getObject({
            Bucket: "vercel",
            Key: `dist/${id}${filePath}`
        }).promise();

        console.log(host, id, filePath);

        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
        res.set("Content-Type", type);

        res.send(content.Body);
    } catch (e: any) {
        if (e.statusCode === 404) {
            // handle item doesn't exist
            res.status(404).send("Not found");
        }
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});