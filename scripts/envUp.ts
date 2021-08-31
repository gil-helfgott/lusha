import {exec, execSync} from "child_process";
import {MongoClient} from "mongodb";
const config = require(`../config/TEST.json`);

export const mongoContainerName = 'lusha-mongo';
export const redisContainerName = 'lusha-redis';

async function envUp() {
    execSync(`docker stop ${mongoContainerName} || true && docker rm ${mongoContainerName} || true`);
    execSync(`docker stop ${redisContainerName} || true && docker rm ${redisContainerName} || true`);
    execSync(`docker run -d -p 27017:27017 --name ${mongoContainerName} mongo`);
    execSync(`docker run -d -p 6379:6379 --name ${redisContainerName} redis`);
    const client = new MongoClient(config.mongo);
    await client.connect();
    await client.db('urls').collection('urls').createIndex({url: 1}, {unique: true});
}

envUp();
