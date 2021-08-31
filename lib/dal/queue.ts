import Queue from "bee-queue";
export const queue = new Queue('parse');


export function insertToQueue(link: string) {
    return queue.createJob(link).save();
}
