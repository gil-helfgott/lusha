import {MongoClient, Db} from "mongodb";
const config = require(`../../config/${process.env.ENV}.json`);

const client = new MongoClient(config.mongo);

const dbs: {
    [dbName: string]: Db
} = {};

export async function getMongoClient(db: string) {
    if (dbs[db]) {
        return dbs[db];
    }
    await client.connect();
    dbs[db] = await client.db(db);
    return dbs[db];
}
