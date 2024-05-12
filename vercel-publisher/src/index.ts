import express from "express"
import cors from "cors"
import {generate} from "./utils";
import simpleGit  from "simple-git";
import * as path from "path";
import {getAllFiles} from "./files";
import {uploadFile} from "./aws";
import { createClient } from 'redis';

const app = express();
const publisher = createClient();

app.use(cors())
app.use(express.json())

publisher.connect();

app.listen(3000, () => {
    console.log('Server is running');
});

app.post('/deploy', async (req, res) => {
    const { repoUrl } = req.body;
    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    for (const file of files) {
        await uploadFile(file.slice(__dirname.length + 1), file);
    }

    await publisher.lPush('build-queue' as any, id as any);

    console.log('id: ', id);
    console.log(repoUrl);

    res.json({ message: "Deployment started", id })
});

