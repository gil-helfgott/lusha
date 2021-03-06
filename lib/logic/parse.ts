import axios from "axios";
import { chain, map } from 'lodash';
import {filterUrlsAlreadyInDb, saveUrl} from "../dal/parse";
import {insertToQueue, queue} from "../dal/queue";
import {DoneCallback, Job} from "bee-queue";
const fakeLinks = [
    'https://www.google.com/',
    'https://www.facebook.com/',
    'https://www.twitter.com/',
    'https://www.instagram.com/',
    'https://www.ynet.co.il/',
    'https://www.asos.com',
    'https://www.amazon.com/',
    'https://cloud.google.com/',
    'https://aws.amazon.com/',
    'https://azure.microsoft.com/en-us/'
];


export async function parse(link: string) {
    console.log(`processing: ${link}`);
    const html = (await axios.get(link)).data;
    const links = chain(fakeLinks).map(link => Math.random() < 0.5 && link).compact().value();
    const res =  {
        html,
        links
    };

    await saveUrl(link, html);
    const linksToParse = await filterUrlsAlreadyInDb(links);
    map(linksToParse, link => insertToQueue(link));
    return res;
}

export function listenToQueue() {
    queue.process(async (job: Job<string>, done: DoneCallback<any>) => {
        const link = job.data;
        const result = parse(link);
        return done(null, result);
    });
}
