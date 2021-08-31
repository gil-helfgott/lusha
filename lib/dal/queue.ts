import Queue, {DoneCallback, Job} from "bee-queue";
import {parse} from "../logic/parse";

export const queue = new Queue('parse');


export function insertToQueue(link: string) {
    return queue.createJob(link).save();
}


queue.process(async (job: Job<string>, done: DoneCallback<any>) => {
    const link = job.data;
    const result = parse(link);
    return done(null, result);
});
