import {suite, describe, it, beforeEach} from "mocha";
import {replace, fake, SinonSpy, restore} from "sinon";
import {parse} from "../lib/logic/parse";
import {getMongoClient} from "../lib/dal/mongo";
import * as assert from "assert";
import {queue} from "../lib/dal/queue";

suite('unit tests', () => {
    describe('parse', () => {
        beforeEach(async () => {
            const mongo = await getMongoClient('urls');
            await mongo.collection('urls').deleteMany({});
            restore();
            await queue.destroy();
        });

        it('parse should return an object with html and links', async () => {
            // Bad test, If we wouldn't use mock data I would send as input a url that I know will not change
            // and then it will be possible to check the html and links without this test breaking with each Google
            // deployment
            const res = await parse('https://www.google.com');
            assert.equal(typeof res.html, 'string');
            assert.equal(Array.isArray(res.links), true);
        });

        it('Should save to DB', async () => {
            const mongo = await getMongoClient('urls');
            await parse('https://www.google.com');
            const googleDoc = await mongo.collection('urls').findOne({
                url: 'https://www.google.com'
            });
            assert.equal(typeof googleDoc?.html, 'string');
        });

        it('Should not save duplicate url to DB', async () => {
            const mongo = await getMongoClient('urls');
            await parse('https://www.google.com');
            await parse('https://www.google.com');

            const googleDocs = await mongo.collection('urls').find({
                url: 'https://www.google.com'
            }).toArray();
            assert.equal(googleDocs.length, 1);
        });

        it('should insert links to queue', async () => {
            replace(queue, "createJob", fake.returns({save: () => {}}));
            await parse('https://www.google.com');
            assert.equal(((queue.createJob as unknown) as SinonSpy).called, true);
        });
    })
})
