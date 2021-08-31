import {keyBy, reject } from "lodash";
import {getMongoClient} from "./mongo";

export async function saveUrl(url: string, html: string) {
    const mongo = await getMongoClient('urls');
    return mongo.collection('urls').updateOne({
        url
    }, {
        $set: {
            url,
            html
        }
    }, {
        upsert: true
    });
}

export async function filterUrlsAlreadyInDb(urls: string[]): Promise<string[]> {
    const mongo = await getMongoClient('urls');
    const alreadyInDb =  await mongo.collection('urls').find({
        urls: {$in: urls}
    }).toArray();

    const alreadyInDbHash = keyBy(alreadyInDb, doc => doc.url);

    return reject(urls, url => !!alreadyInDbHash[url]);
}

