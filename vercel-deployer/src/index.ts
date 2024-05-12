import { createClient, commandOptions } from "redis";
import {copyBuiltFiles, downloadS3Folder} from "./aws";
import {buildProject} from "./utils";

const subscriber = createClient();
subscriber.connect();

async function main() {
    while(true) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true } as any),
            'build-queue' as any,
            0 as any
        );

        await downloadS3Folder(`output/${res?.element}`);
        await buildProject(res?.element as any);
        await copyBuiltFiles(res?.element as any)

        console.log(res?.element)
    }
}

main();